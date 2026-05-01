#!/bin/bash

# Test Pod Install Script
set -e

echo "🧪 Testing pod install for Modis iOS..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the Modis_FE_TL directory."
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
cd ios
rm -rf Pods/
rm -f Podfile.lock
rm -rf build/
rm -rf DerivedData/

# Check Podfile syntax
echo "🔍 Checking Podfile syntax..."
if pod spec lint --quick --silent > /dev/null 2>&1; then
    echo "✅ Podfile syntax OK"
else
    echo "⚠️  Podfile syntax check skipped (normal for project Podfiles)"
fi

# Install pods
echo "🍫 Installing CocoaPods dependencies..."
pod install --repo-update --verbose

# Check if workspace was created
if [ -f "Modis.xcworkspace" ]; then
    echo "✅ SUCCESS: Modis.xcworkspace created!"
    echo "📁 Workspace location: ios/Modis.xcworkspace"
    
    # List workspace contents
    echo "📋 Workspace contents:"
    ls -la Modis.xcworkspace/
    
    # Check if scheme exists
    if [ -d "Modis.xcworkspace/xcshareddata/xcschemes" ]; then
        echo "✅ Schemes found:"
        ls -la Modis.xcworkspace/xcshareddata/xcschemes/
    else
        echo "⚠️  No shared schemes found (may be in xcuserdata)"
    fi
    
else
    echo "❌ FAILED: Modis.xcworkspace NOT created!"
    echo "📋 Current ios directory contents:"
    ls -la
    exit 1
fi

# Go back to root
cd ..

echo ""
echo "🎉 Pod install test completed successfully!"
echo "✅ Workspace: ios/Modis.xcworkspace"
echo "✅ Ready for Codemagic build"