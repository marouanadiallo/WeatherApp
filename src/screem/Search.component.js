import React, {useState, useEffect} from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Text, Divider, Layout, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { ThemeContext, toogleThemeIconFill, toogleThemeIconOutiline } from '../modules/theme-context';
import { BackIcon } from '../modules/load-Icons.js';



const SearchScreen =  ({navigation}) => {
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
        <SafeAreaView  style={styles.container}>
            <TopNavigation title='Recherche' alignment='center' accessoryLeft={BackAction} accessoryRight={toogleTheme}/>
            <Divider/>
            <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>     
            <Text category="h1">recherche</Text>
            </Layout>
        </SafeAreaView>
    );
}

export default SearchScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    }
});