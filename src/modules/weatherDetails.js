import React from 'react';
import { Image, StyleSheet, RefreshControl, ScrollView, View } from 'react-native';
import { Divider, Layout, Text, List, Button } from '@ui-kitten/components';

import { getIconApi } from "../api/OpenWeather.js"
import PrintItemHourly from '../modules/itemsHourly.js';
import PrintItemDaily from '../modules/itemsDaily.js';
import {FavIcon, FavIconOutline } from '../modules/load-Icons.js';


import moment from 'moment';
import 'moment/locale/fr';
//import { ScrollView } from 'react-native-gesture-handler';

moment.locale('fr');


const WeatherDetails = ({weatherToLocation, callback_func_Refreshing, refreshing, isFavorite=null, func_toggle_fav=null}) =>{
    //if (refreshing) {
      //  console.log("refresing");
   // }
    const day = (dt) => {
        let day = moment(dt * 1000).format('dddd');
        day = day.charAt(0).toUpperCase() + day.slice(1);
        return day;
    }
    const percentage = 66;

    return(
        <Layout style={styles.container}>
            <Divider/>
            <Layout style={{flex:1}}>
                <ScrollView 
                    contentContainerStyle={{flex:1, flexDirection:"column", justifyContent:"center"}}
                    refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={callback_func_Refreshing}
                        />
                    }
                >
                    <Layout style={styles.cardDayTemp} status='basic'>
                        <Layout style={styles.cardDayTemp}>
                        <Text category="h4">{day(weatherToLocation.current.dt)}</Text>
                        <Layout style={{justifyContent:"center", alignItems:"center"}}>
                            <Image source={{uri:getIconApi(weatherToLocation.current.weather[0].icon)}} style={{ width: 60, height: 60 }}/>
                            <Text category="h5" style={{alignSelf:"center"}}>
                            {Math.round (weatherToLocation.current.temp) }°
                            </Text>
                            <Layout>
                               <Text>{weatherToLocation.current.weather[0].description}</Text>
                                {
                                    isFavorite !== null ?
                                    (
                                        isFavorite ? 
                                        (
                                            <Button appearance="ghost" status='primary' accessoryLeft={FavIcon} onPress={func_toggle_fav} />
                                        ):
                                        (
                                            <Button appearance="ghost" status='primary' accessoryLeft={FavIconOutline} onPress={func_toggle_fav} />
                                        )
                                        
                                    ): null
                                }
                            </Layout>
                        </Layout>
                        </Layout>
                    </Layout>
                </ScrollView>     
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
                <Divider/>
                <Layout style={{ paddingHorizontal: 10 }}>
                  <Layout style={{marginTop:10}}>
                    <Text category="h6">NIVEAU DE CONFORT</Text>
                  </Layout>
                  <Layout>
                    <Text category="h6">VENT</Text>
                    <Image source={require('../../assets/eolienne.gif')}
                        style={{width:100, height:100}}
                    />
                  </Layout>
                  <Layout>
                    <Text category="h6">LEVERR ET COUCHER DE SOLEIL</Text>
                  </Layout>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default WeatherDetails;

const styles = StyleSheet.create({
    container: {
      flex: 10,
     // borderColor: "green",
      //borderWidth: 1
    },
    cardDayTemp : {
      flex:1,
      justifyContent: "center",
      alignItems: "center",
      //borderColor: "green",
      //borderWidth: 1
    },
    cardForecastByHoursDay: {
        //borderWidth: 1,
        //borderColor: "blue"
    },
    cardForecastByDay: {
      flex: 2,
      marginTop:5,
      //borderColor:"green",
      //borderWidth:1,
      paddingHorizontal:10
    }
});