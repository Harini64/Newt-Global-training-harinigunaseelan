# Use bundled Maven + bypass PKIX issues on some Windows setups (corporate SSL inspection).
$Backend = Join-Path (Split-Path -Parent $PSScriptRoot) "backend"
$MavenHome = Join-Path $Backend ".tools\apache-maven-3.9.6"
$env:MAVEN_OPTS = "-Daether.connector.https.securityMode=insecure -Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true"
$env:Path = "$(Join-Path $MavenHome 'bin');" + $env:Path

if (-not $env:JAVA_HOME) {
    $jdk17 = Get-ChildItem "C:\Program Files\Java" -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -match 'jdk-17|jdk17' } | Select-Object -First 1
    if ($jdk17) { $env:JAVA_HOME = $jdk17.FullName }
}

function Invoke-Mvn {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)
    Set-Location $Backend
    & (Join-Path $MavenHome "bin\mvn.cmd") @Args -s (Join-Path $Backend ".mvn\settings.xml")
}
