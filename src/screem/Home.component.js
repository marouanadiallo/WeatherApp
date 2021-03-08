import React, {useState, useEffect, useCallback} from 'react';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import { SafeAreaView, StyleSheet } from 'react-native';
import { TopNavigationAction, TopNavigation, Spinner, Layout, Button, Divider, Text, Card, Modal } from '@ui-kitten/components';
import { ThemeContext, toogleThemeIconFill, toogleThemeIconOutiline } from '../modules/theme-context';


import { SearchIcon } from '../modules/load-Icons.js';
import WeatherDetails from '../modules/weatherDetails.js'
import { getWeather } from '../api/OpenWeather.js';

const HomeScreem = ({ navigation }) => {

  const themeContext = React.useContext(ThemeContext);
  const [location, setLocation] = useState(null);
  const [geocode, setGeocode] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weatherToLocation, setWeatToLocation] = useState([]); 
  const [visible, setVisible] = React.useState(false);


  const [isLoading, setIsLoading] = useState(false); 
  const [refreshing, setRefreshing] = useState(false);
  
   useEffect(() => {
        (async () => {
          let { status } = await Permissions.askAsync(Permissions.LOCATION).catch((error)=>{
            console.log("error to acces for permission !");
          });
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Highest}).catch((errror) =>{
            console.log("error to get location !");
          });
          const { latitude , longitude } = location.coords;
          setLocation({latitude, longitude});
          try {

            setGeocode(await Location.reverseGeocodeAsync({ latitude , longitude }).catch((error)=>{
              console.log("error get adresse !");
            }));
          } catch (error) {
            console.log("no init geocode !");
          }
          
          
          try {
            getWeatherToLocation(latitude, longitude);
          } catch (error) {
            console.log("error loading api !"+ error);
          }
        })();
  }, []);

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  
  const onRefresh = useCallback(() => {
    //console.log(location);
    try {
      const {latitude, longitude} = location;
      getWeatherToLocation(latitude, longitude);
      setRefreshing(true);
      wait(2000).then(() => setRefreshing(false));
    } catch (error) {
      console.log("error loading api ! "+error);
    }
    
  }, [location]);

  const toogleTheme = () => (
    themeContext.toggleTheme === 'light' ? 
      <TopNavigationAction icon={toogleThemeIconOutiline} onPress={themeContext.toggleTheme}/>:
      <TopNavigationAction icon={toogleThemeIconFill} onPress={themeContext.toggleTheme}/>
  );

  const navigateSearchWeatherByLocation = () => {
    navigation.navigate('Search');
  }

  const goSearchScreen = () => (
    <TopNavigationAction icon={SearchIcon} onPress={navigateSearchWeatherByLocation} />
  );
  const navigateDetails = () => {
     navigation.navigate('Details', {geocode:location});
  };

  const getWeatherToLocation = async (latitude, longitude) => {
    const results = await getWeather(latitude, longitude);
    setWeatToLocation(results);
    setIsLoading(true);
    //console.log(weatherToLocation.daily);
  }
  const printModal = () => {
    setVisible(true);
  }
  return (
    
    isLoading ? 
    (
      <SafeAreaView  style={styles.container}>
        {
          weatherToLocation.cod === 429 ?
          (
            <Modal visible={visible}>
              <Card disabled={true}>
                <Text>{weatherToLocation.message}</Text>
                <Button onPress={() => setVisible(false)}>
                  Fermer
                </Button>
              </Card>
            </Modal>
          ):
          (
            <Layout style={{flex:1}}>
               <TopNavigation title={geocode[0].city} alignment='center' accessoryLeft={goSearchScreen} accessoryRight={toogleTheme}/>
              <Layout style={{flex:1}}>
                <WeatherDetails weatherToLocation={weatherToLocation} callback_func_Refreshing={onRefresh} refreshing={refreshing}/>
                <Divider/>
              </Layout>
            </Layout>
           
          )
        } 
      </SafeAreaView>
    ) : 
    <SafeAreaView style={[styles.container ,{justifyContent:"center", alignItems:"center"}]}>
      <Spinner size='giant'/>
    </SafeAreaView>
  );
}

export default HomeScreem;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});