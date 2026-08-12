param(
    [string]$BackendPath,
    [switch]$SkipBrowserInstall
)

# Windows PowerShell 5.1 converts native stderr warnings into ErrorRecord objects.
# Native tools are checked with LASTEXITCODE below; PowerShell-level failures use explicit throw.
$ErrorActionPreference = "Continue"
$onWindows = $env:OS -eq "Windows_NT"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$frontendPath = Join-Path $repoRoot "FrontEnd"
$composeFile = Join-Path $frontendPath "e2e/docker-compose.e2e.yml"
$artifactPath = Join-Path $frontendPath "e2e-artifacts"
$projectName = "globaltimes-fe-e2e-$PID"

if (-not $BackendPath) {
    $BackendPath = Join-Path (Split-Path $repoRoot -Parent) "GlobalTimes_BeSide"
}
$BackendPath = (Resolve-Path $BackendPath).Path

New-Item -ItemType Directory -Force -Path $artifactPath | Out-Null
$dockerContext = ""
if ($onWindows) {
    $dockerConfigPath = Join-Path $artifactPath "docker-config"
    New-Item -ItemType Directory -Force -Path $dockerConfigPath | Out-Null
    $env:DOCKER_CONFIG = $dockerConfigPath
    $env:DOCKER_HOST = "npipe:////./pipe/dockerDesktopLinuxEngine"
}
$backendLog = Join-Path $artifactPath "backend.log"
$backendErrorLog = Join-Path $artifactPath "backend-error.log"
$frontendLog = Join-Path $artifactPath "frontend.log"
$frontendErrorLog = Join-Path $artifactPath "frontend-error.log"
$mockLog = Join-Path $artifactPath "gemini-mock.log"
$mockErrorLog = Join-Path $artifactPath "gemini-mock-error.log"

$backendProcess = $null
$frontendProcess = $null
$mockProcess = $null
$composeStarted = $false

function Wait-Http([string]$Url, [int]$TimeoutSeconds = 120) {
    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        try {
            $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 3
            if ([int]$response.StatusCode -lt 500) { return }
        } catch {
            Start-Sleep -Seconds 2
        }
    }
    throw "Timed out waiting for $Url"
}

function Test-PortOpen([int]$Port) {
    $client = [System.Net.Sockets.TcpClient]::new()
    try {
        $task = $client.ConnectAsync("127.0.0.1", $Port)
        return $task.Wait(300) -and $client.Connected
    } catch {
        return $false
    } finally {
        $client.Dispose()
    }
}

function Test-DockerReady([string]$Context = "") {
    $dockerCommand = (Get-Command docker -ErrorAction SilentlyContinue).Source
    if (-not $dockerCommand) { return $false }

    $arguments = @()
    if ($Context) { $arguments += @("--context", $Context) }
    $arguments += @("info", "--format", "{{.ServerVersion}}")

    $probeOut = Join-Path $artifactPath "docker-probe.out.log"
    $probeError = Join-Path $artifactPath "docker-probe.error.log"
    $startProcessArgs = @{
        FilePath = $dockerCommand
        ArgumentList = $arguments
        RedirectStandardOutput = $probeOut
        RedirectStandardError = $probeError
        PassThru = $true
    }
    if ($onWindows) {
        $startProcessArgs.WindowStyle = "Hidden"
    }

    $probe = Start-Process @startProcessArgs
    try {
        if (-not $probe.WaitForExit(5000)) {
            $probe.Kill()
            $probe.WaitForExit()
            return $false
        }
        $version = Get-Content $probeOut -Raw -ErrorAction SilentlyContinue
        return -not [string]::IsNullOrWhiteSpace($version)
    } finally {
        $probe.Dispose()
    }
}

function Stop-Tree($Process) {
    if (-not $Process -or $Process.HasExited) { return }
    if ($onWindows) {
        & taskkill.exe /PID $Process.Id /T /F 2>$null | Out-Null
    } else {
        & pkill -TERM -P $Process.Id 2>$null
        Stop-Process -Id $Process.Id -Force -ErrorAction SilentlyContinue
    }
}

try {
    foreach ($port in 8080, 5173, 19099, 13306, 16379) {
        if (Test-PortOpen $port) {
            throw "Port $port is already in use. Stop the existing process before running E2E."
        }
    }

    $dockerReady = Test-DockerReady $dockerContext
    if (-not $dockerReady) {
        if ($onWindows) {
            $dockerDesktop = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
            if (-not (Test-Path $dockerDesktop)) { throw "Docker Desktop is not installed." }
            Start-Process -FilePath $dockerDesktop -WindowStyle Hidden | Out-Null
        }
        $dockerDeadline = (Get-Date).AddSeconds(120)
        while ((Get-Date) -lt $dockerDeadline) {
            if (Test-DockerReady $dockerContext) {
                $dockerReady = $true
                break
            }
            Start-Sleep -Seconds 3
        }
    }
    if (-not $dockerReady) { throw "Docker engine is not ready." }

    $composeStarted = $true
    & docker compose -p $projectName -f $composeFile up -d
    if ($LASTEXITCODE -ne 0) { throw "Failed to start E2E containers." }

    for ($i = 0; $i -lt 60; $i++) {
        & docker compose -p $projectName -f $composeFile exec -T mysql mysqladmin ping -h 127.0.0.1 -uroot -pe2epw *> $null
        $mysqlReady = $LASTEXITCODE -eq 0
        & docker compose -p $projectName -f $composeFile exec -T redis redis-cli ping *> $null
        $redisReady = $LASTEXITCODE -eq 0
        if ($mysqlReady -and $redisReady) { break }
        Start-Sleep -Seconds 2
    }
    if (-not ($mysqlReady -and $redisReady)) { throw "E2E containers are not healthy." }

    $nodeCommand = if ($onWindows) { "node.exe" } else { "node" }
    $mockProcess = Start-Process -FilePath $nodeCommand `
        -ArgumentList (Join-Path $frontendPath "e2e/support/gemini-mock.cjs") `
        -WorkingDirectory $frontendPath `
        -RedirectStandardOutput $mockLog `
        -RedirectStandardError $mockErrorLog `
        -PassThru
    Wait-Http "http://127.0.0.1:19099" 30

    $env:SPRING_DATASOURCE_URL = "jdbc:mysql://127.0.0.1:13306/globaltimes?useSSL=false&useUnicode=true&serverTimezone=Asia/Seoul&allowPublicKeyRetrieval=true"
    $env:SPRING_DATASOURCE_USERNAME = "root"
    $env:SPRING_DATASOURCE_PASSWORD = "e2epw"
    $env:SPRING_DATA_REDIS_HOST = "127.0.0.1"
    $env:SPRING_DATA_REDIS_PORT = "16379"
    $env:GEMINI_API_KEY = "e2e-key"
    $env:GEMINI_BASE_URL = "http://127.0.0.1:19099"
    $env:GOOGLE_API_KEY = "e2e-key"
    $env:NEWS_API_KEY = "e2e-key"
    $env:GOOGLE_OAUTH_CLIENT_ID = "e2e-client"
    $env:GOOGLE_OAUTH_CLIENT_SECRET = "e2e-secret"
    $env:JWT_SECRET = "e2e_jwt_secret_key_must_be_at_least_32_characters"
    $env:NEWS_FETCH_ENABLED = "false"
    $env:AI_SUMMARY_SAVE_ENABLED = "false"

    $gradleCommand = if ($onWindows) { Join-Path $BackendPath "gradlew.bat" } else { Join-Path $BackendPath "gradlew" }
    $backendProcess = Start-Process -FilePath $gradleCommand `
        -ArgumentList "bootRun" `
        -WorkingDirectory $BackendPath `
        -RedirectStandardOutput $backendLog `
        -RedirectStandardError $backendErrorLog `
        -PassThru
    Wait-Http "http://127.0.0.1:8080/api/articles/latest?page=0&size=1" 180

    $fixturePath = Join-Path $frontendPath "e2e/fixtures/full-stack-smoke.sql"
    & docker compose -p $projectName -f $composeFile cp $fixturePath mysql:/tmp/full-stack-smoke.sql
    if ($LASTEXITCODE -ne 0) { throw "Failed to copy E2E fixture." }
    & docker compose -p $projectName -f $composeFile exec -T mysql sh -c "mysql --default-character-set=utf8mb4 -uroot -pe2epw globaltimes < /tmp/full-stack-smoke.sql"
    if ($LASTEXITCODE -ne 0) { throw "Failed to load E2E fixture." }

    $translationFixturePath = Join-Path $frontendPath "e2e/fixtures/redis-translations.json"
    $translationFixtures = Get-Content $translationFixturePath -Raw -Encoding utf8 | ConvertFrom-Json
    foreach ($translationFixture in $translationFixtures) {
        $setResult = (& docker compose -p $projectName -f $composeFile exec -T redis redis-cli SETEX $translationFixture.key 3600 $translationFixture.value) -join ""
        if ($LASTEXITCODE -ne 0 -or $setResult.Trim() -ne "OK") {
            throw "Failed to load Redis translation fixture."
        }
        $cachedTranslation = (& docker compose -p $projectName -f $composeFile exec -T redis redis-cli GET $translationFixture.key) -join ""
        if ($LASTEXITCODE -ne 0 -or $cachedTranslation.Trim() -ne $translationFixture.value) {
            throw "Redis translation fixture verification failed."
        }
    }

    $trendFixtureDir = Join-Path $frontendPath "e2e/fixtures/trends"
    foreach ($countryCode in "KR", "US", "GB") {
        $trendFixturePath = Join-Path $trendFixtureDir "$countryCode.json"
        $containerFixturePath = "/tmp/trend-$countryCode.json"
        & docker compose -p $projectName -f $composeFile cp $trendFixturePath "redis:$containerFixturePath"
        if ($LASTEXITCODE -ne 0) { throw "Failed to copy Redis trend fixture for $countryCode." }
        $setResult = (& docker compose -p $projectName -f $composeFile exec -T redis sh -c "redis-cli -x SETEX trend:$countryCode 173400 < $containerFixturePath") -join ""
        if ($LASTEXITCODE -ne 0 -or $setResult.Trim() -ne "OK") {
            throw "Failed to load Redis trend fixture for $countryCode."
        }
        $trendExists = (& docker compose -p $projectName -f $composeFile exec -T redis redis-cli EXISTS "trend:$countryCode") -join ""
        if ($LASTEXITCODE -ne 0 -or $trendExists.Trim() -ne "1") {
            throw "Redis trend fixture verification failed for $countryCode."
        }
    }

    $npmCommand = if ($onWindows) { "npm.cmd" } else { "npm" }
    $frontendProcess = Start-Process -FilePath $npmCommand `
        -ArgumentList "run", "dev", "--", "--host", "127.0.0.1", "--port", "5173" `
        -WorkingDirectory $frontendPath `
        -RedirectStandardOutput $frontendLog `
        -RedirectStandardError $frontendErrorLog `
        -PassThru
    Wait-Http "http://localhost:5173" 90

    Push-Location $frontendPath
    try {
        $npxCommand = if ($onWindows) { "npx.cmd" } else { "npx" }
        if (-not $SkipBrowserInstall) {
            & $npxCommand playwright install chromium
            if ($LASTEXITCODE -ne 0) { throw "Failed to install Playwright Chromium." }
        }
        $env:E2E_BASE_URL = "http://localhost:5173"
        & $npxCommand playwright test
        if ($LASTEXITCODE -ne 0) { throw "Playwright E2E failed." }
    } finally {
        Pop-Location
    }

    $perspectivesCacheExists = (& docker compose -p $projectName -f $composeFile exec -T redis redis-cli EXISTS "perspectives:article:990102") -join ""
    if ($LASTEXITCODE -ne 0 -or $perspectivesCacheExists.Trim() -ne "1") {
        throw "Perspectives cache was not created by the E2E flow."
    }
} finally {
    Stop-Tree $frontendProcess
    Stop-Tree $backendProcess
    Stop-Tree $mockProcess
    if ($composeStarted) {
        & docker compose -p $projectName -f $composeFile logs --no-color *> (Join-Path $artifactPath "containers.log")
        & docker compose -p $projectName -f $composeFile down -v --remove-orphans
    }
}
