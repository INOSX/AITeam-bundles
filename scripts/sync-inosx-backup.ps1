[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$repoRoot = Split-Path -Parent $PSScriptRoot
function Invoke-GitChecked {
    param([string[]]$GitArgs)
    $result = @(& git -C $repoRoot @GitArgs)
    if ($LASTEXITCODE -ne 0) { throw "Git failed: $($GitArgs[0])" }
    return $result
}
$source = (Invoke-GitChecked @('remote','get-url','origin')) -join ''
$target = (Invoke-GitChecked @('remote','get-url','gitea')) -join ''
if ($source -ne 'https://github.com/INOSX/AITeam-bundles.git' -or
    $target -ne 'http://inosx.git.local:3000/INOSX/AgentOS-Bundles.git') {
    throw 'Unexpected source or backup remote. No push performed.'
}
Invoke-GitChecked @('fetch','origin','--tags') | Out-Null
$sourceRefs = @(Invoke-GitChecked @('ls-remote','--refs','origin','refs/heads/*','refs/tags/*'))
if ($sourceRefs.Count -eq 0) { throw 'Source has no refs; refusing backup.' }
$specs = @($sourceRefs | ForEach-Object {
    $parts = $_ -split '\s+'
    "$($parts[0]):$($parts[1])"
})
# Atomic, fast-forward-only updates. Divergence requires investigation, never force.
Invoke-GitChecked (@('push','--atomic','gitea') + $specs) | Out-Null
$backupRefs = @(Invoke-GitChecked @('ls-remote','--refs','gitea','refs/heads/*','refs/tags/*'))
$missing = @($sourceRefs | Where-Object { $_ -notin $backupRefs })
if ($missing.Count -gt 0) { throw 'Backup verification failed: source refs differ.' }
$sourceAfter = @(Invoke-GitChecked @('ls-remote','--refs','origin','refs/heads/*','refs/tags/*'))
if (@(Compare-Object $sourceRefs $sourceAfter).Count -gt 0) {
    throw 'Source changed during backup; run synchronization again.'
}
Write-Output "Verified $($sourceRefs.Count) source refs in INOSX backup. No refs deleted."
