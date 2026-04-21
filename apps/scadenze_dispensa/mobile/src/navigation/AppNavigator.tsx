import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/HomeScreen';
import AggiungiProdottoScreen from '../screens/AggiungiProdottoScreen';
import ListaSpesaScreen from '../screens/ListaSpesaScreen';
import ImpostazioniScreen from '../screens/ImpostazioniScreen';

const DispensaStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DispensaStackNavigator() {
  return (
    <DispensaStack.Navigator screenOptions={{ headerShown: true }}>
      <DispensaStack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Scadenze Dispensa Gratis' }} />
      <DispensaStack.Screen name="AggiungiProdotto" component={AggiungiProdottoScreen} options={{ title: 'Aggiungi Prodotto' }} />
    </DispensaStack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';
          if (route.name === 'Dispensa') {
            iconName = focused ? 'kitchen' : 'kitchen';
          } else if (route.name === 'Spesa') {
            iconName = focused ? 'shopping-list' : 'shopping-list';
          } else if (route.name === 'Impostazioni') {
            iconName = focused ? 'settings' : 'settings';
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#EF4444',
        tabBarInactiveTintColor: '#9CA3AF',
      })}
    >
      <Tab.Screen name="Dispensa" component={DispensaStackNavigator} options={{ title: 'Dispensa' }} />
      <Tab.Screen name="Spesa" component={ListaSpesaScreen} options={{ title: 'Spesa' }} />
      <Tab.Screen name="Impostazioni" component={ImpostazioniScreen} options={{ title: 'Impostazioni' }} />
    </Tab.Navigator>
  );
}
