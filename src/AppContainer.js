import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import { PaperProvider, MD3LightTheme, MD3DarkTheme, adaptNavigationTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useSelector } from 'react-redux';

import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = {
  ...MD3LightTheme,
  ...LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
  },
};
const CombinedDarkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
  },
};

import Main from './screens/Main';
import Login from './screens/Login';
import Profile from './screens/Profile';
import Register from './screens/Register';

import HabitsAppBar from './components/HabitsAppBar';

export default AppContainer = () => {
  const Stack = createNativeStackNavigator();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const user = useSelector((state) => state.user.user);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={user?.theme == 'white' ? CombinedDefaultTheme : CombinedDarkTheme}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              header: (props) => <HabitsAppBar {...props} />,
            }}
            initialRouteName={isLoggedIn ? 'Main' : 'Login'}
          >
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Profile" component={Profile} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};
