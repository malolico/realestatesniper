# Factory Git Hardening - READ ONLY local verifier
# Usage:
#   powershell -File scripts/git/verifyGitHardening.ps1
#   powershell -File scripts/git/verifyGitHardening.ps1 -ExpectedHead <sha>
#   powershell -File scripts/git/verifyGitHardening.ps1 -AllowInactiveHooksPath

[CmdletBinding()]
param(
  [string]$ExpectedHead = "",
  [switch]$AllowInactiveHooksPath
)

$ErrorActionPreference = "Stop"
$ExpectedOrigin = "https://github.com/malolico/realestatesniper.git"
$ExpectedBranch = "integration/factory-complete-20260725"

$script:Failures = New-Object System.Collections.Generic.List[string]
$script:Blocks = New-Object System.Collections.Generic.List[string]

function Add-Fail([string]$m) { $script:Failures.Add($m) | Out-Null }
function Add-Block([string]$m) { $script:Blocks.Add($m) | Out-Null }

function GitText([string[]]$GitArgs) {
  $out = & git @GitArgs 2>&1
  return @{ Code = $LASTEXITCODE; Text = (($out | Out-String).TrimEnd()) }
}

$top = GitText @("rev-parse","--show-toplevel")
if ($top.Code -ne 0) {
  Add-Block "not a git repo"
} else {
$Root = $top.Text
Set-Location -LiteralPath $Root

$gitPath = Join-Path $Root ".git"
if ((Test-Path -LiteralPath $gitPath) -and -not (Get-Item -LiteralPath $gitPath -Force).PSIsContainer) {
  Add-Block "WORKTREE OR NONSTANDARD GIT DIR REQUIRES REVIEW"
}
$gdir = GitText @("rev-parse","--git-dir")
$common = GitText @("rev-parse","--git-common-dir")
if ($gdir.Code -eq 0 -and $common.Code -eq 0) {
  $gAbs = [System.IO.Path]::GetFullPath((Join-Path $Root $gdir.Text))
  $cAbs = [System.IO.Path]::GetFullPath((Join-Path $Root $common.Text))
  if ($gAbs -ne $cAbs) { Add-Block "WORKTREE OR NONSTANDARD GIT DIR REQUIRES REVIEW" }
}

if ($script:Blocks.Count -eq 0) {

$origin = GitText @("remote","get-url","origin")
if ($origin.Text -ne $ExpectedOrigin) { Add-Fail "origin mismatch: $($origin.Text)" }

$branch = GitText @("branch","--show-current")
if ($branch.Text -ne $ExpectedBranch) { Add-Fail "branch mismatch: $($branch.Text)" }

$local = GitText @("rev-parse","HEAD")
$remote = GitText @("rev-parse","@{u}")
$ab = GitText @("rev-list","--left-right","--count","HEAD...@{u}")
if ($local.Text -ne $remote.Text) { Add-Fail "local HEAD != remote HEAD" }
if ($ab.Text -ne "0`t0") { Add-Fail "ahead/behind not 0/0: $($ab.Text)" }
if ($ExpectedHead -and $local.Text -ne $ExpectedHead) { Add-Fail "HEAD != -ExpectedHead $ExpectedHead" }

$trackedDirty = @(git status --porcelain | Where-Object { $_ -notmatch '^\?\?' -and $_ -notmatch '^!!' })
$unauthorizedDirty = @($trackedDirty | Where-Object {
  $_ -notmatch '\.gitignore$' -and
  $_ -notmatch '\.gitattributes$' -and
  $_ -notmatch '\.githooks[/\\]pre-commit$' -and
  $_ -notmatch 'scripts[/\\]git[/\\]' -and
  $_ -notmatch 'FACTORY_GIT_HARDENING'
})
if ($unauthorizedDirty.Count -gt 0) {
  Add-Fail ("unauthorized tracked dirty: " + ($unauthorizedDirty -join "; "))
}

$staged = @(git diff --cached --name-only)
if ($staged.Count -gt 0) { Add-Fail "staged files present: $($staged.Count)" }

$hooksPath = (& git config --local --get core.hooksPath 2>$null)
if ($LASTEXITCODE -ne 0) { $hooksPath = "" }
if (-not $hooksPath) {
  if (-not $AllowInactiveHooksPath) {
    Add-Fail "core.hooksPath empty (hook not locally activated yet)"
  } else {
    Write-Host "NOTE: core.hooksPath inactive (pre-activation mode)"
  }
} elseif ($hooksPath -ne ".githooks") {
  Add-Fail "core.hooksPath conflict: '$hooksPath'"
}

foreach ($rel in @(
  ".githooks/pre-commit",
  "scripts/git/guardStagedForbiddenPaths.js",
  "scripts/git/installGitHardening.ps1",
  ".gitattributes",
  "docs/factory-construction/FACTORY_GIT_HARDENING_OPS_PROTOCOL.md"
)) {
  if (-not (Test-Path -LiteralPath (Join-Path $Root $rel))) { Add-Fail "missing $rel" }
}

$hookBytes = [System.IO.File]::ReadAllBytes((Join-Path $Root ".githooks\pre-commit"))
if ($hookBytes -contains 13) { Add-Fail ".githooks/pre-commit contains CR (not LF-only)" }

$ga = Get-Content -LiteralPath (Join-Path $Root ".gitattributes") -Raw
if ($ga -notmatch '(?m)^\s*\.githooks/\*\s+text\s+eol=lf\s*$') { Add-Fail ".gitattributes missing LF rule" }

$gi = Get-Content -LiteralPath (Join-Path $Root ".gitignore") -Raw
if ($gi -match '(?m)^\s*/data/\s*$' -or $gi -match '(?m)^\s*data/\s*$') { Add-Fail ".gitignore contains global /data/ rule" }

$runtime = @(
  "data/factory-compliance",
  "data/factory-distress",
  "data/factory-economy",
  "data/factory-environment",
  "data/factory-evidence",
  "data/factory-foundation",
  "data/factory-intelligence",
  "data/factory-legitimacy",
  "data/factory-registry"
)
foreach ($d in $runtime) {
  & git check-ignore -q -- $d 2>$null
  if ($LASTEXITCODE -ne 0) {
    & git check-ignore -q -- "$d/probe.json" 2>$null
    if ($LASTEXITCODE -ne 0) { Add-Fail "runtime not ignored: $d" }
  }
  if (-not (Test-Path -LiteralPath $d)) { Add-Fail "runtime physically missing: $d" }
}

& git check-ignore -q -- "estructura_repo.txt" 2>$null
if ($LASTEXITCODE -ne 0) { Add-Fail "estructura_repo.txt not ignored" }

$anom = "ersMalolicorealestatesniper$([char]0xF03E)"
& git check-ignore -q -- $anom 2>$null
if ($LASTEXITCODE -ne 0) { Add-Fail "anomalous root name not ignored" }

& git check-ignore -q -- "data/factory-dso-packs/maricopa/pilot-001/pack.manifest.json" 2>$null
if ($LASTEXITCODE -eq 0) { Add-Fail "factory-dso-packs unexpectedly ignored" }

$dso = @(
  "data/factory-dso-packs/maricopa/pilot-001/CHECKSUMS.sha256",
  "data/factory-dso-packs/maricopa/pilot-001/pack.manifest.json",
  "data/factory-dso-packs/maricopa/pilot-001/provenance.json",
  "data/factory-dso-packs/maricopa/pilot-001/response/ORG-ASR-MC.json",
  "data/factory-dso-packs/maricopa/pilot-001/response/ORG-GIS-MC.json",
  "data/factory-dso-packs/maricopa/pilot-001/response/ORG-RCR-MC.json"
)
foreach ($p in $dso) {
  $t = @(git ls-files -- $p)
  if ($t.Count -gt 0 -and (Test-Path -LiteralPath $p)) { } else { Add-Fail "dso not tracked/present: $p" }
}

$legit = @(
  "docs/factory-construction/FACTORY_EVOLUTION_SP01_IB09_DOCUMENTARY_COMMIT_STATUS.md",
  "docs/factory-construction/FACTORY_EVOLUTION_SP01_IB09_DOCUMENTARY_COMMIT_STATUS_POST_IMPLEMENTATION.md",
  "docs/factory-construction/FACTORY_EVOLUTION_SP01_IB09_IMPLEMENTATION_STATUS.md",
  "docs/factory-construction/FACTORY_EVOLUTION_SP01_IB09_OFFICIAL_DISCOVERY_SPECIFICATION.md",
  "docs/factory-construction/FACTORY_EVOLUTION_SP01_IB09_OFFICIAL_IMPLEMENTATION_MANDATE.md",
  "docs/factory-construction/FACTORY_EVOLUTION_SP01_IB09_OFFICIAL_IMPLEMENTATION_PLAN.md",
  "services/factory-orchestration-edge/cb15OrchestrationExecutor.js",
  "services/factory-orchestration-edge/index.js",
  "services/factory-orchestration-edge/stubExecutor.js",
  "services/factory-orchestration-edge/workerRunner.js",
  "src/runPInt01SliceB2Validation.js",
  "src/runPInt01SliceB4Validation.js",
  "src/runPInt01SliceBSmoke.js",
  "src/runSp01Ib09Cb15OrchestrationValidation.js"
)
foreach ($p in $legit) {
  $t = @(git ls-files -- $p)
  if ($t.Count -eq 0 -or -not (Test-Path -LiteralPath $p)) { Add-Fail "legit SP01-IB-09 missing/untracked: $p" }
}

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) { Add-Fail "node missing" }
else {
  & node "scripts/git/guardStagedForbiddenPaths.js"
  if ($LASTEXITCODE -ne 0) { Add-Fail "guard clean-index exit=$LASTEXITCODE (expected 0)" }
}

$hooksDir = Join-Path $Root ".git\hooks"
if (Test-Path -LiteralPath $hooksDir) {
  $bad = @(Get-ChildItem -LiteralPath $hooksDir -Force | Where-Object { $_.Name -notlike "*.sample" } | ForEach-Object { $_.Name })
  if ($bad.Count -gt 0) { Add-Fail ("non-sample .git/hooks present: " + ($bad -join ", ")) }
}

} # end blocks-empty checks
} # end has-root

Write-Host ""
if ($script:Blocks.Count -gt 0) {
  Write-Host "GIT HARDENING LOCAL STATUS:"
  Write-Host "BLOCKED"
  $script:Blocks | ForEach-Object { Write-Host " - $_" }
  exit 2
}
if ($script:Failures.Count -gt 0) {
  Write-Host "GIT HARDENING LOCAL STATUS:"
  Write-Host "FAIL"
  $script:Failures | ForEach-Object { Write-Host " - $_" }
  exit 1
}
Write-Host "GIT HARDENING LOCAL STATUS:"
Write-Host "PASS"
exit 0
