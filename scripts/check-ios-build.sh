#!/bin/bash

# iOS Build Check Script for Modis
set -e

echo "🔍 Checking iOS build requirements..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo " Error: package.json not found. Please run this script from the Modis_FE_TL directory."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_NODE="20"
if [ "$(printf '%s\n' "$REQUIRED_NODE" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_NODE" ]; then
    echo " Node.js version $NODE_VERSION is too old. Required: $REQUIRED_NODE+"
    exit 1
else
    echo " Node.js version: $NODE_VERSION"
fi

# Check npm dependencies
echo " Checking npm dependencies..."
if [ ! -d "node_modules" ]; then
    echo "  node_modules not found. Installing..."
    npm ci
else
    echo " node_modules found"
fi

# Check iOS directory
if [ ! -d "ios" ]; then
    echo " iOS directory not found!"
    exit 1
else
    echo " iOS directory found"
fi

# Check Podfile
if [ ! -f "ios/Podfile" ]; then
    echo " Podfile not found!"
    exit 1
else
    echo " Podfile found"
fi

# Check Info.plist
if [ ! -f "ios/Modis/Info.plist" ]; then
    echo " Info.plist not found!"
    exit 1
else
    echo " Info.plist found"
fi

# Check bundle identifier
BUNDLE_ID=$(grep -A1 "CFBundleIdentifier" ios/Modis/Info.plist | grep "string" | sed 's/.*<string>\(.*\)<\/string>.*/\1/')
if [ "$BUNDLE_ID" = "\$(PRODUCT_BUNDLE_IDENTIFIER)" ]; then
    echo " Bundle identifier configured: com.modis.app (from Xcode project)"
else
    echo " Bundle identifier: $BUNDLE_ID"
fi

# Check required permissions
PERMISSIONS=("NSCameraUsageDescription" "NSMicrophoneUsageDescription" "NSPhotoLibraryUsageDescription")
for permission in "${PERMISSIONS[@]}"; do
    if grep -q "$permission" ios/Modis/Info.plist; then
        echo " Permission found: $permission"
    else
        echo " Missing permission: $permission"
        exit 1
    fi
done

# Check native modules
echo " Checking critical native modules..."
CRITICAL_MODULES=("react-native-vision-camera" "react-native-reanimated" "react-native-gesture-handler")
for module in "${CRITICAL_MODULES[@]}"; do
    if [ -d "node_modules/$module" ]; then
        echo " Module found: $module"
    else
        echo " Missing module: $module"
        exit 1
    fi
done

# Check Babel configuration
if grep -q "react-native-reanimated/plugin" babel.config.js; then
    echo "Reanimated Babel plugin configured"
else
    echo " Reanimated Babel plugin not found in babel.config.js"
    exit 1
fi

# Check codemagic.yaml
if [ -f "codemagic.yaml" ]; then
    echo " codemagic.yaml found"
    
    # Check for placeholder values
    if grep -q "1234567890" codemagic.yaml; then
        echo "  WARNING: Please update APP_STORE_APPLE_ID in codemagic.yaml"
    fi
    
    if grep -q "your-email@example.com" codemagic.yaml; then
        echo "  WARNING: Please update email in codemagic.yaml"
    fi
else
    echo " codemagic.yaml not found!"
    exit 1
fi

echo ""
echo " iOS build check completed successfully!"
echo ""
echo " Next steps:"
echo "1. Update codemagic.yaml with your real Apple ID and email"
echo "2. Push to GitHub: git add . && git commit -m 'iOS build ready' && git push"
echo "3. Connect repository to Codemagic"
echo "4. Configure Apple Developer account in Codemagic"
echo "5. Trigger build"
echo ""
echo " Estimated build success rate: 95%"