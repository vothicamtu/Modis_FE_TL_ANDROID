module.exports = {
  dependencies: {
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
  assets: ['./assets/fonts/'],
};