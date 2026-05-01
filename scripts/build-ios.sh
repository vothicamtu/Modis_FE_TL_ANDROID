#!/bin/bash

# iOS Build Script for Modis
set -e

echo " Starting iOS build process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo " Error: package.json not found. Please run this script from the Modis_FE_TL directory."
    exit 1
fi

# Install npm dependencies
echo " Installing npm dependencies..."
npm ci

# Navigate to iOS directory
cd ios

# Clean previous builds
echo " Cleaning previous builds..."
rm -rf build/
rm -rf DerivedData/

# Install CocoaPods dependencies
echo " Installing CocoaPods dependencies..."
pod install --repo-update

# Go back to root
cd ..

# Build for iOS
echo "🔨 Building iOS app..."
npx react-native run-ios --configuration Release

echo " iOS build completed successfully!"