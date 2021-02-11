import React from 'react';
import { SafeAreaView } from 'react-native';
import { Button, Text, Divider, Layout, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { ThemeContext, toogleThemeIconFill, toogleThemeIconOutiline } from '../modules/theme-context';


const LocationScreem = ({navigation}) => {
    const themeContext = React.useContext(ThemeContext);

    const toogleTheme = () => (
        themeContext.toggleTheme === 'light' ? 
          <TopNavigationAction icon={toogleThemeIconOutiline} onPress={themeContext.toggleTheme}/>:
          <TopNavigationAction icon={toogleThemeIconFill} onPress={themeContext.toggleTheme}/>
    );

    return (
        <SafeAreaView style={{flex: 1}}>
            <TopNavigation title='Mes Lieux' alignment='center' accessoryRight={toogleTheme}/>
            <Divider/>
            <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text category="h1">Liste de mes lieux</Text>
            </Layout>
        </SafeAreaView>
    );
}

export default LocationScreem;