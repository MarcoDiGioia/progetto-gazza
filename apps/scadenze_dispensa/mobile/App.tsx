import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ProdottiProvider } from '@shared/context/ProdottiContext';
import { SpesaProvider } from '@shared/context/SpesaContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { dbService } from './src/services/DbService';
import { notificheService } from './src/services/NotificheService';
import { adsService } from './src/services/AdsService';

function SplashScreen() {
  return (
    <View style={styles.splashContainer}>
      <ActivityIndicator size="large" color="#EF4444" />
    </View>
  );
}

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await dbService.init();
        await notificheService.init();
        adsService.init();
        setIsInitialized(true);
      } catch (err) {
        console.error('App initialization error:', err);
        setError(err instanceof Error ? err.message : 'Initialization error');
      }
    };

    bootstrap();
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ActivityIndicator size="large" color="#EF4444" />
      </View>
    );
  }

  if (!isInitialized) {
    return <SplashScreen />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <ProdottiProvider dbService={dbService} notificheService={notificheService} adsService={adsService}>
          <SpesaProvider dbService={dbService}>
            <AppNavigator />
          </SpesaProvider>
        </ProdottiProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FEE2E2' },
});

export default App;
