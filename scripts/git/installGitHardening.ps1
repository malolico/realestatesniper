# Factory Git Hardening - local installer
# Default: DRY RUN (no config mutation)
# Mutating mode: -Apply  (GATE B3/B5 only; do not run during Phase B.2 ImpL)
#
# Usage:
#   powershell -File scripts/git/installGitHardening.ps1
#   powershell -File scripts/git/installGitHardening.ps1 -Apply

[CmdletBinding()]
param(
  [switch]$Apply
)

$ErrorActionPreference = "Stop"
$ExpectedOrigin = "https://github.com/malolico/realestatesniper.git"
$ExpectedBranch = "integration/factory-complete-20260725"

# Tracked modifications allowed before B4 publish (official hardening scope).
$AllowedTrackedDirtyPaths = @(
  ".gitignore"
)

function Fail([string]$Code, [string]$Msg) {
  Write-Host "GIT HARDENING INSTALLATION:"
  Write-Host $Code
  Write-Host $Msg
  exit 1
}

function Get-GitText([string[]]$GitArgs) {
  $out = & git @GitArgs 2>&1
  return @{ ExitCode = $LASTEXITCODE; Text = ($out | Out-String).TrimEnd() }
}

function Get-PorcelainPaths([string]$Line) {
  if ([string]::IsNullOrWhiteSpace($Line) -or $Line.Length -lt 4) { return @() }
  $rest = $Line.Substring(3)
  if ($rest -match ' -> ') {
    $parts = $rest -split ' -> ', 2
    return @($parts[0].Trim(), $parts[1].Trim())
  }
  return @($rest.Trim())
}

function Test-AllowedTrackedPath([string]$Path) {
  $n = ($Path -replace '\\', '/')
  if ($n.StartsWith('./')) { $n = $n.Substring(2) }
  foreach ($a in $AllowedTrackedDirtyPaths) {
    if ($n -eq $a) { return $true }
  }
  return $false
}

function Assert-PostApplyGuard([string]$RootPath) {
  $hp = (& git config --local --get core.hooksPath 2>$null)
  if ($LASTEXITCODE -ne 0) { $hp = "" }
  if ($hp -ne ".githooks") {
    Fail "INSTALLATION BLOCKED - POST-APPLY GUARD VERIFICATION FAILED" "core.hooksPath='$hp' (expected .githooks). STOP - no automatic rollback performed."
  }

  $hookRel = ".githooks/pre-commit"
  $guardRel = "scripts/git/guardStagedForbiddenPaths.js"
  if (-not (Test-Path -LiteralPath (Join-Path $RootPath $hookRel))) {
    Fail "INSTALLATION BLOCKED - POST-APPLY GUARD VERIFICATION FAILED" "hook missing after Apply. STOP - no automatic rollback performed."
  }
  if (-not (Test-Path -LiteralPath (Join-Path $RootPath $guardRel))) {
    Fail "INSTALLATION BLOCKED - POST-APPLY GUARD VERIFICATION FAILED" "guard missing after Apply. STOP - no automatic rollback performed."
  }

  & node $guardRel
  $ge = $LASTEXITCODE
  if ($ge -ne 0) {
    Fail "INSTALLATION BLOCKED - POST-APPLY GUARD VERIFICATION FAILED" ("guard exit=" + $ge + " on clean-index check. STOP - diagnose staged index / hardening artifacts. No automatic rollback performed.")
  }
}

$top = Get-GitText @("rev-parse","--show-toplevel")
if ($top.ExitCode -ne 0) { Fail "INSTALLATION BLOCKED - NOT A GIT REPO" $top.Text }
$Root = $top.Text
Set-Location -LiteralPath $Root

$gitPath = Join-Path $Root ".git"
if ((Test-Path -LiteralPath $gitPath) -and -not (Get-Item -LiteralPath $gitPath -Force).PSIsContainer) {
  Fail "INSTALLATION BLOCKED - WORKTREE OR NONSTANDARD GIT DIR REQUIRES REVIEW" ".git is a file"
}

$gdir = Get-GitText @("rev-parse","--git-dir")
$common = Get-GitText @("rev-parse","--git-common-dir")
if ($gdir.ExitCode -ne 0 -or $common.ExitCode -ne 0) {
  Fail "INSTALLATION BLOCKED - WORKTREE OR NONSTANDARD GIT DIR REQUIRES REVIEW" "git-dir resolution failed"
}
$gAbs = [System.IO.Path]::GetFullPath((Join-Path $Root $gdir.Text))
$cAbs = [System.IO.Path]::GetFullPath((Join-Path $Root $common.Text))
if ($gAbs -ne $cAbs) {
  Fail "INSTALLATION BLOCKED - WORKTREE OR NONSTANDARD GIT DIR REQUIRES REVIEW" "git-dir != git-common-dir"
}

$origin = Get-GitText @("remote","get-url","origin")
if ($origin.ExitCode -ne 0 -or $origin.Text -ne $ExpectedOrigin) {
  Fail "INSTALLATION BLOCKED - ORIGIN MISMATCH" "expected $ExpectedOrigin got $($origin.Text)"
}

$branch = Get-GitText @("branch","--show-current")
if ($branch.ExitCode -ne 0 -or $branch.Text -ne $ExpectedBranch) {
  Fail "INSTALLATION BLOCKED - BRANCH MISMATCH" "expected $ExpectedBranch got $($branch.Text)"
}

# Portable project identity markers (no absolute Manolo paths).
$identityMarkers = @(
  "package.json",
  "docs/factory-construction",
  "docs/factory-construction/FACTORY_GIT_HARDENING_PHASE_B_OFFICIAL_IMPLEMENTATION_PLAN.md",
  "services/factory-orchestration-edge",
  "src/runSp01Ib09Cb15OrchestrationValidation.js"
)
foreach ($m in $identityMarkers) {
  if (-not (Test-Path -LiteralPath (Join-Path $Root $m))) {
    Fail "INSTALLATION BLOCKED - PROJECT IDENTITY NOT VERIFIED" "missing marker: $m"
  }
}

$local = Get-GitText @("rev-parse","HEAD")
$remote = Get-GitText @("rev-parse","@{u}")
$ab = Get-GitText @("rev-list","--left-right","--count","HEAD...@{u}")
if ($local.Text -ne $remote.Text -or $ab.Text -ne "0`t0") {
  Write-Host "WARNING: HEAD/upstream not identical (installation may still dry-run)."
  Write-Host "LOCAL=$($local.Text) REMOTE=$($remote.Text) AB=$($ab.Text)"
}

$trackedDirty = @(git status --porcelain | Where-Object { $_ -notmatch '^\?\?' -and $_ -notmatch '^!!' })
$unauthorizedTracked = New-Object System.Collections.Generic.List[string]
foreach ($line in $trackedDirty) {
  foreach ($p in (Get-PorcelainPaths $line)) {
    if (-not (Test-AllowedTrackedPath $p)) {
      $unauthorizedTracked.Add("$line") | Out-Null
      break
    }
  }
}
if ($unauthorizedTracked.Count -gt 0) {
  Write-Host "Unauthorized tracked dirty entries:"
  $unauthorizedTracked | ForEach-Object { Write-Host " - $_" }
  Fail "INSTALLATION BLOCKED - TRACKED WORKING TREE NOT CLEAN" ("unauthorized tracked count=" + $unauthorizedTracked.Count)
}

$staged = @(git diff --cached --name-only)
if ($staged.Count -gt 0) {
  Fail "INSTALLATION BLOCKED - STAGED FILES PRESENT" ("count=" + $staged.Count)
}

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) { Fail "INSTALLATION BLOCKED - NODE MISSING" "node not in PATH" }

$required = @(
  ".githooks/pre-commit",
  "scripts/git/guardStagedForbiddenPaths.js",
  ".gitattributes",
  "scripts/git/verifyGitHardening.ps1"
)
foreach ($rel in $required) {
  if (-not (Test-Path -LiteralPath (Join-Path $Root $rel))) {
    Fail "INSTALLATION BLOCKED - ARTIFACT MISSING" $rel
  }
}

$gitattributes = Get-Content -LiteralPath (Join-Path $Root ".gitattributes") -Raw
if ($gitattributes -notmatch '(?m)^\s*\.githooks/\*\s+text\s+eol=lf\s*$') {
  Fail "INSTALLATION BLOCKED - GITATTRIBUTES RULE MISSING" ".githooks/* text eol=lf"
}

$hooksDir = Join-Path $Root ".git\hooks"
$unexpected = @()
if (Test-Path -LiteralPath $hooksDir) {
  Get-ChildItem -LiteralPath $hooksDir -Force | ForEach-Object {
    if ($_.Name -notlike "*.sample") { $unexpected += $_.Name }
  }
}
if ($unexpected.Count -gt 0) {
  Write-Host "Existing non-sample .git/hooks entries:"
  $unexpected | ForEach-Object { Write-Host " - $_" }
  Fail "INSTALLATION BLOCKED - EXISTING LOCAL HOOKS DETECTED" "non-sample hooks present"
}

$current = (& git config --local --get core.hooksPath 2>$null)
if ($LASTEXITCODE -ne 0) { $current = "" }

Write-Host "Proposed: git config --local core.hooksPath .githooks"
Write-Host "Current core.hooksPath: '$(($current | Out-String).Trim())'"
Write-Host ("Tracked dirty allowed scope: " + ($AllowedTrackedDirtyPaths -join ", "))
Write-Host ("Tracked dirty lines seen: " + $trackedDirty.Count)

if ($current -and $current -ne ".githooks") {
  Fail "INSTALLATION BLOCKED - CORE.HOOKSPATH CONFLICT" "current='$current'"
}

if (-not $Apply) {
  if ($current -eq ".githooks") {
    Write-Host "GIT HARDENING INSTALLATION:"
    Write-Host "DRY RUN PASS"
    Write-Host "Already configured (.githooks). No mutation performed."
    exit 0
  }
  Write-Host "GIT HARDENING INSTALLATION:"
  Write-Host "DRY RUN PASS"
  Write-Host "Would set core.hooksPath=.githooks. No mutation performed."
  exit 0
}

# APPLY mode (authorized only under GATE B3/B5)
if ($current -eq ".githooks") {
  Assert-PostApplyGuard -RootPath $Root
  Write-Host "GIT HARDENING INSTALLATION:"
  Write-Host "APPLY PASS"
  Write-Host "Idempotent: already .githooks; post-Apply guard verification PASS"
  exit 0
}

& git config --local core.hooksPath .githooks
if ($LASTEXITCODE -ne 0) { Fail "INSTALLATION BLOCKED - CONFIG WRITE FAILED" "git config exit $LASTEXITCODE" }
$after = (& git config --local --get core.hooksPath 2>$null)
if ($after -ne ".githooks") {
  Fail "INSTALLATION BLOCKED - CONFIG VERIFY FAILED" "after='$after'"
}

Assert-PostApplyGuard -RootPath $Root

Write-Host "GIT HARDENING INSTALLATION:"
Write-Host "APPLY PASS"
exit 0
