$ErrorActionPreference = "Stop"

function Write-Decision($decision, $reason) {
    $out = @{
        hookSpecificOutput = @{
            hookEventName     = "PreToolUse"
            permissionDecision = $decision
        }
    }
    if ($reason) {
        $out.hookSpecificOutput.permissionDecisionReason = $reason
    }
    Write-Output ($out | ConvertTo-Json -Depth 5 -Compress)
}

try {
    $stdin = [Console]::In.ReadToEnd()
    $payload = $stdin | ConvertFrom-Json
    $command = $payload.tool_input.command
} catch {
    Write-Decision "allow" $null
    exit 0
}

if (-not $command) {
    Write-Decision "allow" $null
    exit 0
}

$budgetFile = Join-Path (Split-Path $PSScriptRoot -Parent) "loop-budget.json"
$defaultMaxIterations = 10
$defaultMaxMinutes = 240

function Get-Budget {
    if (Test-Path $budgetFile) {
        try {
            return Get-Content $budgetFile -Raw | ConvertFrom-Json
        } catch {
            # fall through to default on a corrupt file
        }
    }
    return [PSCustomObject]@{
        maxIterations = $defaultMaxIterations
        maxMinutes    = $defaultMaxMinutes
        iterations    = 0
        startedAt     = $null
    }
}

function Save-Budget($budget) {
    $budget | ConvertTo-Json | Set-Content -Path $budgetFile -Encoding utf8
}

$isCheckoutB = $command -match 'git\s+checkout\s+-b\s'
$isCommit = $command -match 'git\s+commit\b'

if ($isCheckoutB) {
    $budget = Get-Budget
    $budget.iterations = 0
    $budget.startedAt = (Get-Date).ToString("o")
    Save-Budget $budget
}

if ($isCommit) {
    $budget = Get-Budget
    if (-not $budget.startedAt) {
        $budget.startedAt = (Get-Date).ToString("o")
    }
    $budget.iterations = [int]$budget.iterations + 1

    $elapsedMinutes = ((Get-Date) - [datetime]$budget.startedAt).TotalMinutes

    if ($budget.iterations -gt $budget.maxIterations -or $elapsedMinutes -gt $budget.maxMinutes) {
        Save-Budget $budget
        $reason = "Loop budget exceeded: $($budget.iterations)/$($budget.maxIterations) iterations, " +
                  "$([math]::Round($elapsedMinutes, 1))/$($budget.maxMinutes) min elapsed on this branch. " +
                  "Stop and ask the user before continuing."
        Write-Decision "deny" $reason
        exit 0
    }

    Save-Budget $budget
    Write-Decision "allow" $null
    exit 0
}

Write-Decision "allow" $null
exit 0
