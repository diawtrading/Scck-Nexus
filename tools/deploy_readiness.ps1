<#
  Deployment Readiness Reporter (PowerShell version)
  This script scans the project directory for common readiness signals and emits a Markdown report.
  It is designed to work without external dependencies.
#>
param(
  [string]$Root = (Get-Location).Path,
  [string]$Out = "deployment_readiness_report.md"
)

$root = if (Test-Path $Root) { (Resolve-Path $Root).Path } else { (Get-Location).Path }
Write-Host "Scanning project at: $root" -ForegroundColor Cyan

function Test-Exists($path) {
  return Test-Path $path
}

function Scan-Project($rootPath) {
  $checks = @{}

  # CI config presence
  $ciPaths = @(
    "$rootPath\\.github\\workflows",
    "$rootPath\\.circleci",
    "$rootPath\\azure-pipelines.yml",
    "$rootPath\\gitlab-ci.yml",
    "$rootPath\\pipeline.yml"
  )
  $ciPresent = $false
  foreach ($p in $ciPaths) {
    if (Test-Exists $p) { $ciPresent = $true; break }
  }
  $checks["ci_config"] = $ciPresent

  # Release notes
  $checks["release_notes"] = (Test-Exists (Join-Path $rootPath 'CHANGELOG.md')) -or
                            (Test-Exists (Join-Path $rootPath 'RELEASE_NOTES.md')) -or
                            (Test-Exists (Join-Path $rootPath 'RELEASE.md')) -or
                            (Test-Exists (Join-Path $rootPath 'RELEASE_NOTES.txt'))

  # Tests
  $testDirs = @(
    "$rootPath\\tests",
    "$rootPath\\test",
    "$rootPath\\src\\tests"
  )
  $testsPresent = $false
  foreach ($d in $testDirs) { if (Test-Exists $d) { $testsPresent = $true; break } }
  if (-not $testsPresent) {
    if (Test-Exists (Join-Path $rootPath 'package.json')) {
      try {
        $pkg = Get-Content (Join-Path $rootPath 'package.json') -Raw | ConvertFrom-Json
        if ($pkg -and $pkg.scripts -and $pkg.scripts.test) { $testsPresent = $true }
      } catch { $testsPresent = $testsPresent }
    }
    if (-not $testsPresent) {
      if (Test-Exists (Join-Path $rootPath 'requirements.txt') -or Test-Exists (Join-Path $rootPath 'pyproject.toml')) {
        $testsPresent = $true
      }
    }
  }
  $checks["tests_present"] = $testsPresent

  # Lint/config
  $lintPaths = @(
    "$rootPath\\.flake8",
    "$rootPath\\.eslintignore",
    "$rootPath\\.eslintrc.json",
    "$rootPath\\lint.config.js",
    "$rootPath\\tox.ini",
    "$rootPath\\golangci.yml"
  )
  $checks["lint_config"] = $false
  foreach ($lp in $lintPaths) { if (Test-Exists $lp) { $checks["lint_config"] = $true; break } }

  # Docker
  $checks["dockerfile"] = (Test-Exists (Join-Path $rootPath 'Dockerfile')) -or (Test-Exists (Join-Path $rootPath 'docker-compose.yml'))

  # IaC signals
  $checks["terraform"] = (Test-Exists (Join-Path $rootPath 'infra')) -or (Test-Exists (Join-Path $rootPath 'terraform'))
  $checks["k8s"] = (Test-Exists (Join-Path $rootPath 'k8s')) -or (Test-Exists (Join-Path $rootPath 'manifests')) -or (Test-Exists (Join-Path $rootPath 'deployment.yaml'))
  $checks["db_migrations"] = (Test-Exists (Join-Path $rootPath 'migrations')) -or (Test-Exists (Join-Path $rootPath 'db\migrate')) -or (Test-Exists (Join-Path $rootPath 'database\migrations'))

  # Score
  $weights = @{
    'ci_config' = 15;
    'release_notes' = 5;
    'tests_present' = 25;
    'lint_config' = 5;
    'dockerfile' = 10;
    'terraform' = 5;
    'k8s' = 5;
    'db_migrations' = 5
  }
  $score = 0
  foreach ($k in $weights.Keys) {
    if ($checks[$k]) { $score += $weights[$k] }
  }
  $checks["score"] = $score
  return $checks
}

function Render-Report($rootPath, $checks, $outPath) {
  $utc = (Get-Date).ToUniversalTime().ToString('yyyy-MM-dd HH:mm:ss UTC')
  $lines = @()
  $lines += '# Deployment Readiness Report'
  $lines += ''
  $lines += "Date: $utc"
  $lines += "Project root: $rootPath"
  $lines += "Score: $($checks['score'])/100"
  $lines += ''
  $lines += 'Checklist:'
  foreach ($k in @('ci_config','release_notes','tests_present','lint_config','dockerfile','terraform','k8s','db_migrations')) {
    $v = $checks[$k]
    $name = switch ($k) {
      'ci_config'       { 'CI Config' }
      'release_notes'   { 'Release Notes' }
      'tests_present'   { 'Tests Present' }
      'lint_config'     { 'Lint Config' }
      'dockerfile'      { 'Dockerfile' }
      'terraform'       { 'Terraform IaC' }
      'k8s'             { 'K8s Manifests' }
      'db_migrations'   { 'DB Migrations' }
    }
    $status = if ($v) { 'Present' } else { 'Missing' }
    $lines += ("- {0}: {1}" -f $name, $status)
  }
  $lines += ''
  $lines += 'Evidence:'
  if ($checks['ci_config']) { $lines += '  - CI config detected' }
  if ($checks['release_notes']) { $lines += '  - Release notes detected' }
  if ($checks['tests_present']) { $lines += '  - Tests found' }
  if ($checks['lint_config']) { $lines += '  - Lint/config detected' }
  if ($checks['dockerfile']) { $lines += '  - Dockerfile or docker-compose present' }
  if ($checks['terraform']) { $lines += '  - Terraform IaC detected' }
  if ($checks['k8s']) { $lines += '  - Kubernetes manifests detected' }
  if ($checks['db_migrations']) { $lines += '  - DB migrations detected' }
  $lines += ''
  $lines += 'Notes:'
  $lines += '  - This report is auto-generated and may be updated as the repo evolves.'
  $content = $lines -join "`n"
  Set-Content -Path $outPath -Value $content -Encoding UTF8
  return $content
}

if ($PSVersionTable.PSVersion -lt [Version]"5.0") {
  Write-Error "This script requires PowerShell 5.0 or newer."; exit 1
}

$reportRoot = $root
$checks = Scan-Project $reportRoot
$reportPath = if (Test-Path $Out) { (Get-Item $Out).FullName } else { Join-Path $root $Out }
Render-Report -rootPath $reportRoot -checks $checks -outPath $reportPath
Write-Host "Deployment Readiness Report generated at: $reportPath" -ForegroundColor Green
"Score: $($checks['score'])/100" | Write-Host -ForegroundColor Yellow
