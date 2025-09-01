#!/bin/bash

# Comprehensive Test Runner for Vocabulary Learning App
# This script runs all tests and provides detailed reporting

echo "🚀 Starting Comprehensive Test Suite for Vocabulary Learning App"
echo "================================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "PASS")
            echo -e "${GREEN}✅ PASS${NC}: $message"
            ;;
        "FAIL")
            echo -e "${RED}❌ FAIL${NC}: $message"
            ;;
        "WARN")
            echo -e "${YELLOW}⚠️  WARN${NC}: $message"
            ;;
        "INFO")
            echo -e "${BLUE}ℹ️  INFO${NC}: $message"
            ;;
    esac
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking Prerequisites..."
echo "----------------------------"

if command_exists node; then
    NODE_VERSION=$(node --version)
    print_status "PASS" "Node.js found: $NODE_VERSION"
else
    print_status "FAIL" "Node.js not found. Please install Node.js 18+"
    exit 1
fi

if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_status "PASS" "npm found: $NPM_VERSION"
else
    print_status "FAIL" "npm not found. Please install npm"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_status "FAIL" "package.json not found. Please run this script from the project root"
    exit 1
fi

echo ""
echo "📦 Installing Dependencies..."
echo "-----------------------------"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "INFO" "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        print_status "FAIL" "Failed to install dependencies"
        exit 1
    fi
else
    print_status "PASS" "Dependencies already installed"
fi

echo ""
echo "🧹 Cleaning Previous Test Results..."
echo "-----------------------------------"

# Clean previous test results
rm -rf coverage/
rm -rf .nyc_output/
rm -rf test-results/

echo ""
echo "🔧 Running TypeScript Type Check..."
echo "-----------------------------------"

# Run TypeScript type check
npm run type-check
if [ $? -eq 0 ]; then
    print_status "PASS" "TypeScript type check passed"
else
    print_status "FAIL" "TypeScript type check failed"
    TYPE_CHECK_FAILED=true
fi

echo ""
echo "📝 Running ESLint..."
echo "-------------------"

# Run ESLint
npm run lint
if [ $? -eq 0 ]; then
    print_status "PASS" "ESLint passed"
else
    print_status "FAIL" "ESLint failed"
    LINT_FAILED=true
fi

echo ""
echo "🧪 Running Unit Tests..."
echo "------------------------"

# Create test results directory
mkdir -p test-results

# Run tests with coverage
npm run test:coverage -- --json --outputFile=test-results/results.json --coverageDirectory=coverage
TEST_EXIT_CODE=$?

if [ $TEST_EXIT_CODE -eq 0 ]; then
    print_status "PASS" "All tests passed"
else
    print_status "FAIL" "Some tests failed"
fi

echo ""
echo "📊 Test Coverage Report..."
echo "-------------------------"

# Check if coverage report exists
if [ -d "coverage" ]; then
    # Display coverage summary
    if [ -f "coverage/coverage-summary.json" ]; then
        echo "Coverage Summary:"
        cat coverage/coverage-summary.json | jq -r '.total | "Lines: \(.lines.pct)% | Statements: \(.statements.pct)% | Functions: \(.functions.pct)% | Branches: \(.branches.pct)%"'
    else
        print_status "WARN" "Coverage summary not found"
    fi
    
    # Open coverage report in browser if possible
    if command_exists open; then
        print_status "INFO" "Opening coverage report in browser..."
        open coverage/lcov-report/index.html
    elif command_exists xdg-open; then
        print_status "INFO" "Opening coverage report in browser..."
        xdg-open coverage/lcov-report/index.html
    else
        print_status "INFO" "Coverage report available at: coverage/lcov-report/index.html"
    fi
else
    print_status "WARN" "Coverage directory not found"
fi

echo ""
echo "🔍 Running Specific Test Suites..."
echo "----------------------------------"

# Run specific test suites individually for detailed reporting
echo "Running Vocabulary Game Tests..."
npm test -- __tests__/vocabulary.test.ts --verbose

echo ""
echo "Running Vocabulary Page Tests..."
npm test -- __tests__/vocabulary-page.test.ts --verbose

echo ""
echo "Running i18n Tests..."
npm test -- __tests__/i18n.test.ts --verbose

echo ""
echo "📋 Test Results Summary..."
echo "--------------------------"

# Display test results summary
if [ -f "test-results/results.json" ]; then
    echo "Test Results:"
    cat test-results/results.json | jq -r '.testResults[] | "\(.name): \(.status) - \(.assertionResults | length) tests, \(.assertionResults | map(select(.status=="passed")) | length) passed, \(.assertionResults | map(select(.status=="failed")) | length) failed"'
else
    print_status "WARN" "Test results file not found"
fi

echo ""
echo "🚀 Running Integration Tests..."
echo "-------------------------------"

# Run integration tests (if they exist)
if [ -d "__tests__/integration" ]; then
    npm test -- __tests__/integration --verbose
else
    print_status "INFO" "No integration tests found"
fi

echo ""
echo "🔧 Running Build Test..."
echo "------------------------"

# Test if the app builds successfully
print_status "INFO" "Testing build process..."
npm run build
if [ $? -eq 0 ]; then
    print_status "PASS" "Build successful"
else
    print_status "FAIL" "Build failed"
    BUILD_FAILED=true
fi

echo ""
echo "📊 Final Status Report..."
echo "-------------------------"

# Summary of all checks
echo "Summary of Checks:"
echo "=================="

if [ "$TYPE_CHECK_FAILED" = true ]; then
    print_status "FAIL" "TypeScript type check"
else
    print_status "PASS" "TypeScript type check"
fi

if [ "$LINT_FAILED" = true ]; then
    print_status "FAIL" "ESLint"
else
    print_status "PASS" "ESLint"
fi

if [ "$TEST_EXIT_CODE" -eq 0 ]; then
    print_status "PASS" "Unit tests"
else
    print_status "FAIL" "Unit tests"
fi

if [ "$BUILD_FAILED" = true ]; then
    print_status "FAIL" "Build process"
else
    print_status "PASS" "Build process"
fi

echo ""
echo "🎯 Recommendations..."
echo "-------------------"

# Provide recommendations based on results
if [ "$TYPE_CHECK_FAILED" = true ] || [ "$LINT_FAILED" = true ] || [ "$TEST_EXIT_CODE" -ne 0 ] || [ "$BUILD_FAILED" = true ]; then
    print_status "WARN" "Some checks failed. Please review and fix the issues above."
    
    if [ "$TYPE_CHECK_FAILED" = true ]; then
        print_status "INFO" "Fix TypeScript errors: npm run type-check"
    fi
    
    if [ "$LINT_FAILED" = true ]; then
        print_status "INFO" "Fix linting issues: npm run lint"
    fi
    
    if [ "$TEST_EXIT_CODE" -ne 0 ]; then
        print_status "INFO" "Fix failing tests: npm test"
    fi
    
    if [ "$BUILD_FAILED" = true ]; then
        print_status "INFO" "Fix build issues: npm run build"
    fi
else
    print_status "PASS" "All checks passed! Your code is ready for production! 🎉"
fi

echo ""
echo "📁 Generated Files..."
echo "---------------------"

# List generated files
if [ -d "coverage" ]; then
    print_status "INFO" "Coverage report: coverage/lcov-report/index.html"
fi

if [ -d "test-results" ]; then
    print_status "INFO" "Test results: test-results/results.json"
fi

if [ -d ".next" ]; then
    print_status "INFO" "Build output: .next/"
fi

echo ""
echo "🏁 Test Suite Complete!"
echo "======================="

# Exit with appropriate code
if [ "$TYPE_CHECK_FAILED" = true ] || [ "$LINT_FAILED" = true ] || [ "$TEST_EXIT_CODE" -ne 0 ] || [ "$BUILD_FAILED" = true ]; then
    exit 1
else
    exit 0
fi
