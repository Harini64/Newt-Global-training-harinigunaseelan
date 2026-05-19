# Load key=value pairs from repo root .env into the current process (skips comments and blank lines).
$Root = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $Root ".env"
if (-not (Test-Path $envFile)) { return }

Get-Content $envFile | ForEach-Object {
  $line = $_.Trim()
  if (-not $line -or $line.StartsWith('#')) { return }
  $eq = $line.IndexOf('=')
  if ($eq -lt 1) { return }
  $name = $line.Substring(0, $eq).Trim()
  $value = $line.Substring($eq + 1).Trim().Trim('"').Trim("'")
  [Environment]::SetEnvironmentVariable($name, $value, 'Process')
}
