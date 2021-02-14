import React, {useState} from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { List, Divider, Layout, TopNavigation, Text, TopNavigationAction, Input, Button, Spinner} from '@ui-kitten/components';
import { ThemeContext, toogleThemeIconFill, toogleThemeIconOutiline } from '../modules/theme-context';

import { BackIcon, SearchIcon, CloseIcon } from '../modules/load-Icons.js';

import { searchLocation } from '../api/apiOpencage.js'

import PrintResponseSearch from '../modules/responseSearch.js';


const SearchScreen =  ({navigation}) => {
    const themeContext = React.useContext(ThemeContext);
    const [_address, setAddress] = useState('');
    const [arrayAddress, setArrayAddress] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

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

    const loadAddress = async (address) => {
        setAddress(address);
        setIsLoading(true); 
        console.log(isLoading);
        try {
            const response = await searchLocation(address).catch((error)=>{console.log("Error calling api open cage !");})
            //console.log(response);
            if(response.results.length !== 0)
            { 
                           
                setArrayAddress(response.results)
                setIsLoading(false);
            }
        } catch (error) {
            console.log("Error to loading !");
        }
        setIsLoading(false);
    }
    const cleanList = () =>{
        setAddress('');
        setArrayAddress([]);
    }

    const renderItem = ({ item, index }) =>( <PrintResponseSearch result={item} />);

    return (
        <SafeAreaView  style={styles.container}>
            <TopNavigation title='Recherche' alignment='center' accessoryLeft={BackAction} accessoryRight={toogleTheme}/>
            <Divider/>
            <Layout style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'stretch', paddingVertical:15, paddingHorizontal:10 }}>     
                <Input
                    placeholder='Ville, Code postal, Département, ou Pays'
                    value={_address}
                    onChangeText={loadAddress}
                    accessoryRight={SearchIcon}
                />
                <Layout style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                    <Text style={{fontStyle:"italic", fontSize:13}}>Annuler la recherche</Text>
                    {
                       isLoading ?
                       ( 
                           <Layout style={styles.loading_container}>
                               <Spinner size='small'/>
                           </Layout>
                       )
                        : null
                    }
                    <Button appearance='ghost' status='basic' accessoryLeft={CloseIcon} onPress={cleanList}/>
                </Layout>
                <Divider/>
                <Layout style={{flex:1, marginTop:5}}>
                    <List
                        data={arrayAddress}
                        renderItem={renderItem}
                        extraData={arrayAddress}
                        showsVerticalScrollIndicator={false}
                    />
                   
                </Layout>
            </Layout>
        </SafeAreaView>
    );
}

export default SearchScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    select: {
        marginVertical: 2,
    },
    loading_container: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});