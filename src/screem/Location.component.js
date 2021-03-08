import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { List, Divider, Layout, TopNavigation, TopNavigationAction, Spinner } from '@ui-kitten/components';
import { ThemeContext, toogleThemeIconFill, toogleThemeIconOutiline } from '../modules/theme-context';

import { connect } from 'react-redux';
import PrintResponseSearch from '../modules/responseSearch.js';


const LocationScreem = ({navigation, favorites}) => {
    const themeContext = React.useContext(ThemeContext);
    const [isLoading, setIsLoading] = useState(false); 
    const [resultats, setResultats] = useState([]);

    const toogleTheme = () => (
        themeContext.toggleTheme === 'light' ? 
          <TopNavigationAction icon={toogleThemeIconOutiline} onPress={themeContext.toggleTheme}/>:
          <TopNavigationAction icon={toogleThemeIconFill} onPress={themeContext.toggleTheme}/>
    );
    //console.log(favorites);
    useEffect(()=>{
        loadFav();
    },[favorites]);


    const loadFav = () => {
        if(favorites.length > 0){
            let tab = [];
            favorites.forEach(element => {
                const favoritesKeys = Object.keys(element.geocode);
                //console.log( Object.keys(element.geocode));
                if( favoritesKeys.includes("formatted") && favoritesKeys.includes("components") ){
                    const data = {
                        geometry: { lat: element.geocode.latitude, lng: element.geocode.longitude},
                        formatted: element.geocode.formatted,
                        components: element.geocode.components
                    };
                    tab = [data, ...tab];
                }
            });
            setResultats(tab);
            setIsLoading(true);       

        }
    }

    const renderItem = ({ item, index }) =>{
        //console.log(item);
       return ( <PrintResponseSearch result={item} navigation={navigation} isFavorite={true}/>)
    };
   
     //console.log(resultats.length);
    return (
        <SafeAreaView style={{flex: 1}}>
            <TopNavigation title='Mes Lieux' alignment='center' accessoryRight={toogleTheme}/>
            <Divider/>
            {
                isLoading ? 
                (
                    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal:10 }}>
                        <List
                            data={resultats}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator = {false}
                        />
                    </Layout>
                ):
                (
                    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Spinner size='giant'/>
                    </Layout>
                )
            }
            
        </SafeAreaView>
    );
}

const mapStateToProps = state => {
    return {
        favorites: state.favorites.favorites
    }
  }
  
export default connect(mapStateToProps)(LocationScreem);