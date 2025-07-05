import { useEffect } from 'react';

import { Text } from 'react-native-paper';

import * as SplashScreen from 'expo-splash-screen';

import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import { Provider } from 'react-redux';

import AppContainer from './src/AppContainer';

import { fr, registerTranslation } from 'react-native-paper-dates';

export default App = () => {
  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync(); // affichage

        registerTranslation('fr', fr);

        // Chargement des fonts, appels API externes, etc...
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync(); // masquage
      }
    }
    prepare();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
        <AppContainer />
      </PersistGate>
    </Provider>
  );
};
