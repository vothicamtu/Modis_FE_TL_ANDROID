module.exports = {
  dependencies: {
    // Disable Flipper completely for React Native 0.81.4
    ...(process.env.NO_FLIPPER ? { 
      'react-native-flipper': { 
        platforms: { 
          android: { 
            sourceDir: '../node_modules/react-native-flipper/android', 
            packageImportPath: 'io.invertase.flipper' 
          } 
        } 
      } 
    } : {}),
  },
  assets: ['./assets/fonts/'], // Font assets
  project: {
    ios: {
      sourceDir: 'ios',
      xcodeProject: {
        name: 'Modis.xcodeproj',
        isWorkspace: false,
      },
    },
    android: {
      sourceDir: 'android',
      appName: 'app',
      packageName: 'com.modis',
    },
  },
};