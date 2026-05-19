$Backend = "c:\Users\abina\OneDrive\Desktop\AI_Interviewprep\backend"
$Tools = Join-Path $Backend ".tools"
$Zip = Join-Path $Tools "maven.zip"
$MavenDir = Join-Path $Tools "apache-maven-3.9.9"

if (Test-Path (Join-Path $MavenDir "bin\mvn.cmd")) {
    Write-Host "Maven already installed at $MavenDir"
    exit 0
}

New-Item -ItemType Directory -Force -Path $Tools | Out-Null
Write-Host "Downloading Apache Maven 3.9.9..."
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-WebRequest -Uri "https://dlcdn.apache.org/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip" -OutFile $Zip -UseBasicParsing
Expand-Archive -Path $Zip -DestinationPath $Tools -Force
Remove-Item $Zip
Write-Host "Maven installed: $MavenDir"
