import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';


//my component
import  HomeScreen  from '../screem/Home.component.js';
import  DetailsScreen  from '../screem/Details.component.js';
import  LocationScreem from '../screem/Location.component.js';
import  SearchScreen from '../screem/Search.component.js';

import { pinIcon, LocationIcon } from '../modules/load-Icons.js';

const { Navigator, Screen } = createBottomTabNavigator();
const Stack = createStackNavigator();


const HomeNavigator = () => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='Home' component={HomeScreen}/>
    <Stack.Screen name='Details' component={DetailsScreen}/>
    <Stack.Screen name='Search' component={SearchScreen} />
  </Stack.Navigator>
);


const BottomTabBar = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}
    
  >
    <BottomNavigationTab title='Météo' icon={pinIcon}/>
    <BottomNavigationTab title='Mes lieux' icon ={LocationIcon}/>
  </BottomNavigation>
);

const TabNavigator = () => (
  <Navigator tabBar={props => <BottomTabBar {...props} />}>
    <Screen name='Home' component={HomeNavigator}/>
    <Screen name='Locations' component={LocationScreem}/>
  </Navigator>
);
export const AppNavigator = () => (
  <NavigationContainer>
    <TabNavigator/>
  </NavigationContainer>
);