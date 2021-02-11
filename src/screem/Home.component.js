import React, {useState, useEffect} from 'react';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import { SafeAreaView, StyleSheet, Image } from 'react-native';
import { Divider, Layout, TopNavigation, TopNavigationAction, Spinner, Text, Card, List } from '@ui-kitten/components';
import { ThemeContext, toogleThemeIconFill, toogleThemeIconOutiline } from '../modules/theme-context';
import { searchIcon } from '../modules/load-Icons.js';
import PrintItemHourly from '../modules/itemsHourly.js';
import PrintItemDaily from '../modules/itemsDaily.js';

import { getWeather, getIconApi } from '../api/OpenWeather.js';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

const HomeScreem = ({ navigation }) => {

  const themeContext = React.useContext(ThemeContext);
  const [location, setLocation] = useState(null);
  const [geocode, setGeocode] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weatherToLocation, setWeatToLocation] = useState([]); 


  const [isLoading, setIsLoading] = useState(false); 

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
          try {

            setGeocode(await Location.reverseGeocodeAsync({ latitude , longitude }).catch((error)=>{
              console.log("error get adresse !");
            }));
          } catch (error) {
            console.log("no init geocode !");
          }
          setLocation({location: {latitude, longitude}});

          try {
            getWeatherToLocation(latitude, longitude);
          } catch (error) {
            console.log("error loading api !");
          }
        })();
  }, []);

  const toogleTheme = () => (
    themeContext.toggleTheme === 'light' ? 
      <TopNavigationAction icon={toogleThemeIconOutiline} onPress={themeContext.toggleTheme}/>:
      <TopNavigationAction icon={toogleThemeIconFill} onPress={themeContext.toggleTheme}/>
  );

  const navigateSearchWeatherByLocation = () => {
    navigation.navigate('Search');
  }
  const goSearchScreen = () => (
    <TopNavigationAction icon={searchIcon} onPress={navigateSearchWeatherByLocation} />
  );
  const navigateDetails = () => {
     navigation.navigate('Details');
  };

  const getWeatherToLocation = async (latitude, longitude) => {
    const results = await getWeather(latitude, longitude);
    setWeatToLocation(results);
    setIsLoading(true);
    console.log(weatherToLocation.daily);
  }

  const day = (dt) => {
    return moment(dt * 1000).format('dddd');
  }

  return (
    
    isLoading ? 
    (<SafeAreaView  style={styles.container}>
      <TopNavigation title={geocode[0].city} alignment='center' accessoryLeft={goSearchScreen} accessoryRight={toogleTheme}/>
      <Divider/>
      <Layout style={{ flex: 1 }}>     
        <Layout style={styles.cardDayTemp} status='basic'>
          <Layout style={styles.cardDayTemp}>
            <Text category="h4">{day(weatherToLocation.current.dt)}</Text>
            <Layout>
              <Image source={{uri:getIconApi(weatherToLocation.current.weather[0].icon)}} style={{ width: 60, height: 60 }}/>
              <Text category="h5" style={{alignSelf:"center"}}>
                {Math.round (weatherToLocation.current.temp) }°
              </Text>
            </Layout>
          </Layout>
        </Layout>
        <Divider/>
        <Layout style={styles.cardForecastByHoursDay}>
          <List
            data={weatherToLocation.hourly}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem ={({item})=>(
              <PrintItemHourly item={item}/>
              )}
          />
        </Layout>
        <Divider/>
        <Layout style={styles.cardForecastByDay}>
          <List
              style={{flex:1}}
              showsVerticalScrollIndicator={false}
              data={weatherToLocation.daily}
              renderItem ={({item})=>(
                <PrintItemDaily item={item}/>
                )}
            />   
        </Layout>
      </Layout>
    </SafeAreaView>) : 
    <SafeAreaView style={[styles.container ,{justifyContent:"center", alignItems:"center"}]}>
      <Spinner/>
    </SafeAreaView>
  );
}

export default HomeScreem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 2,
  },
  cardDayTemp : {
    flex:1,
    justifyContent: "center",
    alignItems: "center"
  },
  cardForecastByHoursDay: {
  },
  cardForecastByDay: {
    flex: 2,
    marginTop:5,
    //borderColor:"red",
    //borderWidth:1,
    paddingHorizontal:10
  }
});