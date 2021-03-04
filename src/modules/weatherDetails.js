import React from 'react';
import { Image, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { Divider, Layout, Text, List, Button } from '@ui-kitten/components';

import { getIconApi } from "../api/OpenWeather.js"
import PrintItemHourly from '../modules/itemsHourly.js';
import PrintItemDaily from '../modules/itemsDaily.js';
import {FavIcon, FavIconOutline } from '../modules/load-Icons.js';


import moment from 'moment';
import 'moment/locale/fr';
import CircleChart from './circleChart.js'


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
        <ScrollView 
            style={{flex:1}}
            refreshControl={
                <RefreshControl
                refreshing={refreshing}
                onRefresh={callback_func_Refreshing}
                />
            }
        >
            <Divider/>
            <Layout style={{flex:1, paddingTop:20}}>
                <Layout 
                    style={{flex:1, flexDirection:"column", justifyContent:"center"}}
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
                </Layout>     
                <Divider style={{marginTop:10}}/>
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
                <Layout style={{flex:1, paddingHorizontal: 10 }}>
                  <Layout style={{ flex: 1, paddingVertical: 10, marginTop:10, marginBottom:20}}>
                        <Text category="h6" style={{flex:1, paddingVertical:10}}>NIVEAU DE CONFORT</Text>
                        <Text style={{marginLeft:10, paddingBottom:5}}>Humidité</Text>
                        <Layout style={{ flex: 1, flexDirection:"row" ,justifyContent:"center"}}>
                            <Layout style={{marginRight:10}}>
                                <CircleChart />
                            </Layout>
                            <Layout style={{flex:2, justifyContent:'center', alignItems:'center'}}>
                                <Text>description</Text>
                            </Layout>
                        </Layout>
                  </Layout>
                  <Layout style={{flex: 1}}>
                    <Text category="h6" style={{paddingVertical:10}}>VENT</Text>
                    <Image source={require('../../assets/eolienne.gif')}
                        style={{width:100, height:100}}
                    />
                  </Layout>
                  <Layout style={{flex:1, paddingVertical:20}}>
                    <Text category="h6">LEVERR ET COUCHER DE SOLEIL</Text>
                  </Layout>
                </Layout>
            </Layout>
        </ScrollView>
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
        marginTop:5
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