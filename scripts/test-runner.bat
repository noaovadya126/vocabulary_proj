@echo off
REM Comprehensive Test Runner for Vocabulary Learning App (Windows)
REM This script runs all tests and provides detailed reporting

echo 🚀 Starting Comprehensive Test Suite for Vocabulary Learning App
echo ================================================================
echo.

REM Check prerequisites
echo 🔍 Checking Prerequisites...
echo ----------------------------

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ FAIL: Node.js not found. Please install Node.js 18+
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ PASS: Node.js found: %NODE_VERSION%
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ FAIL: npm not found. Please install npm
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✅ PASS: npm found: %NPM_VERSION%
)

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ FAIL: package.json not found. Please run this script from the project root
    exit /b 1
)

echo.
echo 📦 Installing Dependencies...
echo -----------------------------

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo ℹ️  INFO: Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ FAIL: Failed to install dependencies
        exit /b 1
    )
) else (
    echo ✅ PASS: Dependencies already installed
)

echo.
echo 🧹 Cleaning Previous Test Results...
echo -----------------------------------

REM Clean previous test results
if exist "coverage" rmdir /s /q "coverage"
if exist ".nyc_output" rmdir /s /q ".nyc_output"
if exist "test-results" rmdir /s /q "test-results"

echo.
echo 🔧 Running TypeScript Type Check...
echo ----------------------------------

REM Run TypeScript type check
npm run type-check
if %errorlevel% equ 0 (
    echo ✅ PASS: TypeScript type check passed
    set TYPE_CHECK_FAILED=false
) else (
    echo ❌ FAIL: TypeScript type check failed
    set TYPE_CHECK_FAILED=true
)

echo.
echo 📝 Running ESLint...
echo -------------------

REM Run ESLint
npm run lint
if %errorlevel% equ 0 (
    echo ✅ PASS: ESLint passed
    set LINT_FAILED=false
) else (
    echo ❌ FAIL: ESLint failed
    set LINT_FAILED=true
)

echo.
echo 🧪 Running Unit Tests...
echo ------------------------

REM Create test results directory
mkdir "test-results"

REM Run tests with coverage
npm run test:coverage -- --json --outputFile=test-results/results.json --coverageDirectory=coverage
set TEST_EXIT_CODE=%errorlevel%

if %TEST_EXIT_CODE% equ 0 (
    echo ✅ PASS: All tests passed
) else (
    echo ❌ FAIL: Some tests failed
)

echo.
echo 📊 Test Coverage Report...
echo -------------------------

REM Check if coverage report exists
if exist "coverage" (
    echo Coverage report generated successfully
    echo Coverage report available at: coverage/lcov-report/index.html
    
    REM Try to open coverage report
    if exist "coverage\lcov-report\index.html" (
        echo ℹ️  INFO: Opening coverage report in browser...
        start "" "coverage\lcov-report\index.html"
    )
) else (
    echo ⚠️  WARN: Coverage directory not found
)

echo.
echo 🔍 Running Specific Test Suites...
echo ----------------------------------

REM Run specific test suites individually for detailed reporting
echo Running Vocabulary Game Tests...
npm test -- __tests__/vocabulary.test.ts --verbose

echo.
echo Running Vocabulary Page Tests...
npm test -- __tests__/vocabulary-page.test.ts --verbose

echo.
echo Running i18n Tests...
npm test -- __tests__/i18n.test.ts --verbose

echo.
echo 📋 Test Results Summary...
echo --------------------------

REM Display test results summary if available
if exist "test-results\results.json" (
    echo Test results file generated: test-results\results.json
) else (
    echo ⚠️  WARN: Test results file not found
)

echo.
echo 🚀 Running Integration Tests...
echo -------------------------------

REM Run integration tests (if they exist)
if exist "__tests__\integration" (
    npm test -- __tests__/integration --verbose
) else (
    echo ℹ️  INFO: No integration tests found
)

echo.
echo 🔧 Running Build Test...
echo ------------------------

REM Test if the app builds successfully
echo ℹ️  INFO: Testing build process...
npm run build
if %errorlevel% equ 0 (
    echo ✅ PASS: Build successful
    set BUILD_FAILED=false
) else (
    echo ❌ FAIL: Build failed
    set BUILD_FAILED=true
)

echo.
echo 📊 Final Status Report...
echo -------------------------

REM Summary of all checks
echo Summary of Checks:
echo ==================

if "%TYPE_CHECK_FAILED%"=="true" (
    echo ❌ FAIL: TypeScript type check
) else (
    echo ✅ PASS: TypeScript type check
)

if "%LINT_FAILED%"=="true" (
    echo ❌ FAIL: ESLint
) else (
    echo ✅ PASS: ESLint
)

if %TEST_EXIT_CODE% equ 0 (
    echo ✅ PASS: Unit tests
) else (
    echo ❌ FAIL: Unit tests
)

if "%BUILD_FAILED%"=="true" (
    echo ❌ FAIL: Build process
) else (
    echo ✅ PASS: Build process
)

echo.
echo 🎯 Recommendations...
echo -------------------

REM Provide recommendations based on results
if "%TYPE_CHECK_FAILED%"=="true" (
    echo ⚠️  WARN: Some checks failed. Please review and fix the issues above.
    echo ℹ️  INFO: Fix TypeScript errors: npm run type-check
)

if "%LINT_FAILED%"=="true" (
    echo ℹ️  INFO: Fix linting issues: npm run lint
)

if %TEST_EXIT_CODE% neq 0 (
    echo ℹ️  INFO: Fix failing tests: npm test
)

if "%BUILD_FAILED%"=="true" (
    echo ℹ️  INFO: Fix build issues: npm run build
)

if "%TYPE_CHECK_FAILED%"=="false" if "%LINT_FAILED%"=="false" if %TEST_EXIT_CODE% equ 0 if "%BUILD_FAILED%"=="false" (
    echo ✅ PASS: All checks passed! Your code is ready for production! 🎉
)

echo.
echo 📁 Generated Files...
echo ---------------------

REM List generated files
if exist "coverage" (
    echo ℹ️  INFO: Coverage report: coverage\lcov-report\index.html
)

if exist "test-results" (
    echo ℹ️  INFO: Test results: test-results\results.json
)

if exist ".next" (
    echo ℹ️  INFO: Build output: .next\
)

echo.
echo 🏁 Test Suite Complete!
echo =======================

REM Exit with appropriate code
if "%TYPE_CHECK_FAILED%"=="true" (
    exit /b 1
) else if "%LINT_FAILED%"=="true" (
    exit /b 1
) else if %TEST_EXIT_CODE% neq 0 (
    exit /b 1
) else if "%BUILD_FAILED%"=="true" (
    exit /b 1
) else (
    exit /b 0
)
