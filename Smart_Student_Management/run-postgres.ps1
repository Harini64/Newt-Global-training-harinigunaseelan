# Start EduTrack backend (Spring Boot) using PostgreSQL — default application.properties.
# Prereqs: PostgreSQL running, database and credentials match backend settings.
# Under strict execution policy (e.g. AllSigned), use run-postgres.cmd instead of this file.

$ErrorActionPreference = 'Stop'
$repoRoot = $PSScriptRoot
$backend = Join-Path $repoRoot 'backend'

if (-not (Test-Path $backend)) {
    Write-Error "Expected backend at: $backend"
}

if (-not $env:JAVA_HOME) {
    foreach ($p in @(
            'C:\Program Files\Java\jdk-23',
            'C:\Program Files\Java\jdk-21',
            'C:\Program Files\Java\jdk-17')) {
        if (Test-Path (Join-Path $p 'bin\java.exe')) {
            $env:JAVA_HOME = $p
            break
        }
    }
}

if (-not $env:JAVA_HOME -or -not (Test-Path "$env:JAVA_HOME\bin\java.exe")) {
    Write-Error 'Set JAVA_HOME to your JDK (e.g. C:\Program Files\Java\jdk-17).'
}

if (-not $env:MAVEN_OPTS) {
    $env:MAVEN_OPTS = '-Djavax.net.ssl.trustStoreType=Windows-ROOT'
}

$mvn = Join-Path $env:USERPROFILE '.m2\maven-install\apache-maven-3.9.5\bin\mvn.cmd'
if (-not (Test-Path $mvn)) {
    $mvn = Join-Path $backend 'mvnw.cmd'
}
if (-not (Test-Path $mvn)) {
    $mvn = 'mvn'
}

Push-Location $backend
try {
    Write-Host "JAVA_HOME=$env:JAVA_HOME"
    Write-Host "Maven: $mvn"
    & $mvn spring-boot:run
}
finally {
    Pop-Location
}
