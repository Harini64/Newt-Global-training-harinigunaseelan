@echo off
setlocal
REM EduTrack: start Spring Boot with PostgreSQL (no .ps1 — works under strict execution policy).
cd /d "%~dp0"

if not defined JAVA_HOME (
  if exist "C:\Program Files\Java\jdk-23\bin\java.exe" set "JAVA_HOME=C:\Program Files\Java\jdk-23"
  if not defined JAVA_HOME if exist "C:\Program Files\Java\jdk-21\bin\java.exe" set "JAVA_HOME=C:\Program Files\Java\jdk-21"
  if not defined JAVA_HOME if exist "C:\Program Files\Java\jdk-17\bin\java.exe" set "JAVA_HOME=C:\Program Files\Java\jdk-17"
)

if not exist "%JAVA_HOME%\bin\java.exe" (
  echo ERROR: JAVA_HOME is not set or is not a JDK. Example: set JAVA_HOME=C:\Program Files\Java\jdk-17
  exit /b 1
)

if not defined MAVEN_OPTS set "MAVEN_OPTS=-Djavax.net.ssl.trustStoreType=Windows-ROOT"

set "MVN=%USERPROFILE%\.m2\maven-install\apache-maven-3.9.5\bin\mvn.cmd"
if not exist "%MVN%" set "MVN=%~dp0backend\mvnw.cmd"
if not exist "%MVN%" set "MVN=mvn"

echo JAVA_HOME=%JAVA_HOME%
echo Maven: %MVN%
cd /d "%~dp0backend"
call "%MVN%" spring-boot:run
exit /b %ERRORLEVEL%
