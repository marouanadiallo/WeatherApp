import React, {useContext, useState, useEffect, useCallback} from 'react';
import { SafeAreaView } from 'react-native';
import { Divider, Layout, Spinner, TopNavigation, TopNavigationAction, Button } from '@ui-kitten/components';
import { ThemeContext, toogleThemeIconFill, toogleThemeIconOutiline } from '../modules/theme-context';

import { connect } from 'react-redux';

import { BackIcon } from '../modules/load-Icons.js';
import { getWeather } from '../api/OpenWeather.js';
import WeatherDetails from '../modules/weatherDetails.js'

const DetailsScreen = ({ navigation, route, dispatch, favorites }) => {

  //console.log(route.params.geocode);
  const themeContext = useContext(ThemeContext);
  const { latitude, longitude, formatted, components } = route.params.geocode;
  const [results, setResults] = useState([]);

  const [isLoading, setIsLoading] = useState(false); 
  const [refreshing, setRefreshing] = useState(false);

  useEffect(()=>{
    setIsLoading(false);
    getWeatherToLocation(latitude, longitude);
    //console.log("reload");
  }, [route.params.geocode]);

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
  const getWeatherToLocation = async (latitude, longitude) => {
    const results = await getWeather(latitude, longitude);
    setResults(results);
    setIsLoading(true);
    //console.log(weatherToLocation.daily);
  }

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  
  const onRefresh = useCallback(() => {
    //console.log(location);
    try {
      getWeatherToLocation(latitude, longitude);
      setRefreshing(true);
      wait(2000).then(() => setRefreshing(false));
    } catch (error) {
      console.log("error loading api ! "+error);
    }
    
  }, [route.params.geocode]);

  const toggleFavorite= () => {
    const action = { type: "TOGGLE_FAVORITE", value: { geocode:{ latitude:latitude, longitude:longitude, formatted:formatted, components:components} } }
    dispatch(action);
  }
  //console.log(results);
  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation title={formatted.substring(0, formatted.indexOf(","))} alignment='center' accessoryLeft={BackAction} accessoryRight={toogleTheme}/>
      <Divider/>
      {
        isLoading ? 
        (
          <Layout style={{ flex: 1 }}>
            <WeatherDetails weatherToLocation={results} callback_func_Refreshing={onRefresh} refreshing={refreshing} isFavorite={
              favorites.findIndex( elem => elem.geocode.latitude === latitude && elem.geocode.longitude === longitude ) === -1 ? false:true
            } func_toggle_fav={toggleFavorite}/>
          </Layout>
        ):
        (
          <Layout style={{flex: 1, justifyContent:"center", alignItems:"center"}}>
            <Spinner size='giant'/>
          </Layout>
        )
      }
    </SafeAreaView>
    
  );
};
const mapStateToProps = state => {
  return {
      favorites: state.favorites.favorites
  }
}

export default connect (mapStateToProps)(DetailsScreen);