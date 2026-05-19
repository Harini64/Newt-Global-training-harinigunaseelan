$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
. (Join-Path $PSScriptRoot "load-env.ps1")
$Backend = Join-Path $Root "backend"
$Frontend = Join-Path $Root "frontend"
$MavenHome = Join-Path $Backend ".tools\apache-maven-3.9.6"
$Mvn = Join-Path $MavenHome "bin\mvn.cmd"

if (-not $env:JAVA_HOME) {
    $jdk = Get-ChildItem "C:\Program Files\Java" -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -match "jdk" } | Select-Object -First 1
    if ($jdk) { $env:JAVA_HOME = $jdk.FullName }
}

if (-not $env:MISTRAL_API_KEY) {
    Write-Warning "MISTRAL_API_KEY not set - copy .env.example to .env and add your key."
}

Write-Host "Building backend..."
Set-Location $Backend
$env:MAVEN_OPTS = "-Daether.connector.https.securityMode=insecure -Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true"
& $Mvn install -DskipTests -q -s (Join-Path $Backend ".mvn\settings.xml")
if ($LASTEXITCODE -ne 0) { throw "Maven build failed" }

$profile = "local"

function Start-JavaService($name, $module, $port) {
    $jar = Get-ChildItem (Join-Path (Join-Path $Backend $module) "target") -Filter "*.jar" |
        Where-Object { $_.Name -notmatch "sources|javadoc|original" } |
        Select-Object -First 1
    if (-not $jar) { throw "JAR not found for $module" }

    Write-Host "Starting $name on port $port..."
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = "java"
    $psi.Arguments = "-Dspring.profiles.active=$profile -jar `"$($jar.FullName)`""
    $psi.WorkingDirectory = Join-Path $Backend $module
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true

  # Inherit current process env (includes MISTRAL_API_KEY from load-env.ps1)
    foreach ($key in [Environment]::GetEnvironmentVariables("Process").Keys) {
        $psi.EnvironmentVariables[$key] = [Environment]::GetEnvironmentVariable($key, "Process")
    }

    [System.Diagnostics.Process]::Start($psi) | Out-Null
    Start-Sleep -Seconds 8
}

Start-JavaService "auth-service" "auth-service" 8081
Start-JavaService "resume-service" "resume-service" 8082
Start-JavaService "interview-service" "interview-service" 8083
Start-JavaService "notification-service" "notification-service" 8084
Start-JavaService "ai-service" "ai-service" 8085
Start-JavaService "gateway-service" "gateway-service" 8080

Write-Host "Starting frontend..."
Set-Location $Frontend
if (-not (Test-Path "node_modules")) {
    npm install --legacy-peer-deps
}
$psiFe = New-Object System.Diagnostics.ProcessStartInfo
$psiFe.FileName = "npm.cmd"
$psiFe.Arguments = "run dev"
$psiFe.WorkingDirectory = $Frontend
$psiFe.UseShellExecute = $false
$psiFe.CreateNoWindow = $true
foreach ($key in [Environment]::GetEnvironmentVariables("Process").Keys) {
    $psiFe.EnvironmentVariables[$key] = [Environment]::GetEnvironmentVariable($key, "Process")
}
[System.Diagnostics.Process]::Start($psiFe) | Out-Null
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "========================================="
Write-Host "  App ready: http://localhost:5173"
Write-Host "  API Gateway: http://localhost:8080"
if ($env:MISTRAL_API_KEY) { Write-Host ('  AI: Mistral (' + $env:MISTRAL_CHAT_MODEL + ')') }
Write-Host "========================================="
