param (
    [Parameter(Mandatory=$true)]
    [string]$ProjectName
)

$env:TARGET_PROJECT = $ProjectName
$ProjectDir = "projects/$ProjectName"

if (-not (Test-Path $ProjectDir)) {
    Write-Error "エラー: 指定されたプロジェクトが存在しません: $ProjectDir"
    exit 1
}

$TestResultsDir = "$ProjectDir/test-results"
if (-not (Test-Path $TestResultsDir)) {
    New-Item -ItemType Directory -Force -Path $TestResultsDir | Out-Null
}

$LogFile = "$TestResultsDir/execute.log"

# テスト実行し、標準出力・標準エラー出力を execute.log にリダイレクト
npx playwright test --config=playwright.config.ts > $LogFile 2>&1
$lastStatus = $LASTEXITCODE

exit $lastStatus
