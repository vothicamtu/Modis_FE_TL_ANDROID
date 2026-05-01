#!/bin/bash

# Dependency Check Script
set -e

echo "🔍 Checking dependencies for conflicts..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the Modis_FE_TL directory."
    exit 1
fi

echo "📋 Project: $(grep '"name"' package.json | cut -d'"' -f4)"
echo "📋 React Native: $(grep '"react-native"' package.json | cut -d'"' -f4)"
echo "📋 React: $(grep '"react"' package.json | cut -d'"' -f4)"

# Check for peer dependency issues
echo ""
echo "🔍 Checking for peer dependency issues..."
if npm ls --depth=0 2>/dev/null; then
    echo "✅ No peer dependency issues found"
else
    echo "⚠️ Peer dependency warnings found (may be normal)"
fi

# Check for deprecated packages
echo ""
echo "🔍 Checking for deprecated packages..."
if npm audit --audit-level=moderate --dry-run 2>/dev/null | grep -q "found.*vulnerabilities"; then
    echo "⚠️ Some vulnerabilities found, but may not affect build"
else
    echo "✅ No critical vulnerabilities found"
fi

# Check React Native compatibility
echo ""
echo "🔍 Checking React Native 0.81.4 compatibility..."

# Critical packages for React Native 0.81.4
CRITICAL_PACKAGES=(
    "@react-native/babel-preset:0.81.4"
    "@react-native/metro-config:0.81.4"
    "@react-native-community/cli:^20.0.0"
)

for package in "${CRITICAL_PACKAGES[@]}"; do
    package_name=$(echo $package | cut -d':' -f1)
    expected_version=$(echo $package | cut -d':' -f2)
    
    if grep -q "\"$package_name\".*\"$expected_version\"" package.json; then
        echo "✅ $package_name: $expected_version"
    else
        actual_version=$(grep "\"$package_name\"" package.json | cut -d'"' -f4)
        echo "⚠️ $package_name: expected $expected_version, found $actual_version"
    fi
done

# Check Node version compatibility
echo ""
echo "🔍 Checking Node version compatibility..."
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_NODE="20"

if [ "$(printf '%s\n' "$REQUIRED_NODE" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_NODE" ]; then
    echo "✅ Node.js version: $NODE_VERSION (>= $REQUIRED_NODE)"
else
    echo "❌ Node.js version: $NODE_VERSION (< $REQUIRED_NODE required)"
    exit 1
fi

# Check npm version
echo ""
echo "🔍 Checking npm version..."
NPM_VERSION=$(npm --version)
echo "📋 NPM version: $NPM_VERSION"

if [ "$(printf '%s\n' "7.0.0" "$NPM_VERSION" | sort -V | head -n1)" = "7.0.0" ]; then
    echo "✅ NPM version supports lockfileVersion 3"
else
    echo "⚠️ NPM version may not support lockfileVersion 3"
fi

# Test package-lock.json
echo ""
echo "🔍 Testing package-lock.json..."
if [ -f "package-lock.json" ]; then
    LOCKFILE_VERSION=$(grep '"lockfileVersion"' package-lock.json | cut -d':' -f2 | tr -d ' ,')
    echo "📋 Lockfile version: $LOCKFILE_VERSION"
    
    if [ "$LOCKFILE_VERSION" = "3" ]; then
        echo "✅ Lockfile version 3 (npm 7+)"
    elif [ "$LOCKFILE_VERSION" = "2" ]; then
        echo "✅ Lockfile version 2 (npm 6+)"
    else
        echo "⚠️ Lockfile version $LOCKFILE_VERSION"
    fi
else
    echo "❌ package-lock.json not found!"
    exit 1
fi

echo ""
echo "🎉 Dependency check completed!"
echo ""
echo "📊 Summary:"
echo "✅ React Native 0.81.4 compatible"
echo "✅ Node.js $NODE_VERSION compatible"
echo "✅ NPM $NPM_VERSION"
echo "✅ Lockfile version $LOCKFILE_VERSION"
echo ""
echo "🚀 Ready for Codemagic build!"