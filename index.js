/**
 * @format
 */
import 'react-native-reanimated';
import 'text-encoding-polyfill';
import { AppRegistry } from 'react-native';
import Home from './src/screens/Home';
import SendPhoto from './src/screens/Send_photo'
import MyNavigation from './src/navigation/Navigation'
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => MyNavigation);
