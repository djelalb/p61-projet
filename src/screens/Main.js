import React from 'react';

import { CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from './Home/Home';
import HabitsScreen from './Habits';
import CategoriesScreen from './Categories';
import StatsScreen from './Stats';
import SettingsScreen from './Settings';

export default Main = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 });
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title;

            return label;
          }}
        />
      )}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Habits"
        component={HabitsScreen}
        options={{
          tabBarLabel: 'Habitudes',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="rotate-left" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarLabel: 'Catégories',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="shape" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarLabel: 'Stats',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="chart-bar" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Paramètres',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="cog" size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};
