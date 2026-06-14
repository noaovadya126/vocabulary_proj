# Builds VocabQuest debug APK locally (downloads Android SDK once into .tools/)
$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
Set-Location $Root

$Jdk = Get-ChildItem "C:\Program Files\Eclipse Adoptium" -Directory -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $Jdk) {
  $JdkPath = Join-Path $Root ".tools\jdk-21"
  if (Test-Path "$JdkPath\bin\java.exe") { $env:JAVA_HOME = $JdkPath }
} else {
  $env:JAVA_HOME = $Jdk.FullName
}
if (-not $env:JAVA_HOME) { throw "Java JDK not found. Install Temurin 21 first." }

$SdkRoot = Join-Path $Root ".tools\android-sdk"
$CmdToolsZip = Join-Path $Root ".tools\cmdline-tools.zip"
$CmdToolsDir = Join-Path $SdkRoot "cmdline-tools"
$LatestDir = Join-Path $CmdToolsDir "latest"

if (-not (Test-Path "$LatestDir\bin\sdkmanager.bat")) {
  Write-Host "Downloading Android command-line tools..."
  New-Item -ItemType Directory -Force -Path (Join-Path $Root ".tools") | Out-Null
  $needDownload = -not (Test-Path $CmdToolsZip) -or (Get-Item $CmdToolsZip -ErrorAction SilentlyContinue).Length -lt 50MB
  if ($needDownload) {
    if (Test-Path $CmdToolsZip) { Remove-Item $CmdToolsZip -Force -ErrorAction SilentlyContinue }
    curl.exe -L --retry 5 --retry-delay 3 -o $CmdToolsZip "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip"
  } else {
    Write-Host "Using existing command-line tools download."
  }
  if (-not (Test-Path $CmdToolsZip) -or (Get-Item $CmdToolsZip).Length -lt 1MB) {
    throw "Failed to download Android command-line tools."
  }
  New-Item -ItemType Directory -Force -Path $LatestDir | Out-Null
  Expand-Archive -Path $CmdToolsZip -DestinationPath $CmdToolsDir -Force
  $inner = Get-ChildItem $CmdToolsDir -Directory | Where-Object { $_.Name -ne "latest" } | Select-Object -First 1
  if ($inner) {
    Get-ChildItem $inner.FullName | Move-Item -Destination $LatestDir -Force
    Remove-Item $inner.FullName -Recurse -Force -ErrorAction SilentlyContinue
  }
}

$env:ANDROID_HOME = $SdkRoot
$env:ANDROID_SDK_ROOT = $SdkRoot
$SdkManager = Join-Path $LatestDir "bin\sdkmanager.bat"

Write-Host "Installing Android SDK packages (first run may take several minutes)..."
$yes = ("y`n" * 20)
$yes | & $SdkManager --sdk_root=$SdkRoot "platform-tools" "platforms;android-36" "build-tools;36.0.0" 2>&1 | Out-Host

Write-Host "Preparing Capacitor assets..."
node scripts/prepare-android-ci.mjs

$sdkDir = $SdkRoot -replace '\\', '\\'
[System.IO.File]::WriteAllText((Join-Path $Root "android\local.properties"), "sdk.dir=$sdkDir`n", [System.Text.UTF8Encoding]::new($false))

Write-Host "Building APK..."
Set-Location android
$GradleBat = Join-Path $Root ".tools\gradle-8.14.3\bin\gradle.bat"
$GradleZip = Join-Path $Root ".tools\gradle-8.14.3-all.zip"
$GradleDir = Join-Path $Root ".tools\gradle-8.14.3"
if (-not (Test-Path $GradleBat)) {
  if (-not (Test-Path $GradleZip) -or (Get-Item $GradleZip -ErrorAction SilentlyContinue).Length -lt 100MB) {
    Write-Host "Downloading Gradle 8.14.3..."
    curl.exe -L --retry 5 -o $GradleZip "https://services.gradle.org/distributions/gradle-8.14.3-all.zip"
  }
  Expand-Archive -Path $GradleZip -DestinationPath (Join-Path $Root ".tools") -Force
  if (Test-Path "$GradleDir-all") { Rename-Item "$GradleDir-all" $GradleDir -Force -ErrorAction SilentlyContinue }
}
if (Test-Path $GradleBat) {
  & $GradleBat assembleDebug --no-daemon
} else {
  & .\gradlew.bat assembleDebug --no-daemon
}
if ($LASTEXITCODE -ne 0) { throw "Gradle build failed with exit code $LASTEXITCODE" }
Set-Location $Root

$ApkSrc = "android\app\build\outputs\apk\debug\app-debug.apk"
$ReleaseDir = "release"
$ApkOut = "$ReleaseDir\VocabQuest.apk"
New-Item -ItemType Directory -Force -Path $ReleaseDir | Out-Null
Copy-Item $ApkSrc $ApkOut -Force

Write-Host ""
Write-Host "APK ready: $((Resolve-Path $ApkOut).Path)"
Write-Host "Copy to your phone and install, or share via WhatsApp/Drive."
