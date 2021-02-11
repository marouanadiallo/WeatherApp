import React from 'react';
import { SafeAreaView } from 'react-native';
import { Divider, Icon, Layout, Text, TopNavigation, TopNavigationAction, Button } from '@ui-kitten/components';
import { ThemeContext, toogleThemeIconFill, toogleThemeIconOutiline } from '../modules/theme-context';
import { BackIcon } from '../modules/load-Icons.js';


const DetailsScreen = ({ navigation }) => {
  const themeContext = React.useContext(ThemeContext);

  const toogleTheme = () => (
    themeContext.toggleTheme === 'light' ? 
      <TopNavigationAction icon={toogleThemeIconOutiline} onPress={themeContext.toggleTheme}/>:
      <TopNavigationAction icon={toogleThemeIconFill} onPress={themeContext.toggleTheme}/>
  );
  
  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack}/>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation title='Météo' alignment='center' accessoryLeft={BackAction} accessoryRight={toogleTheme}/>
      <Divider/>
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text category="h1">DETAILS</Text>
      </Layout>
    </SafeAreaView>
    
  );
};

export default DetailsScreen;