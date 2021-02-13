import React from 'react';
import { Image, StyleSheet, RefreshControl } from 'react-native';
import { Divider, Layout, Text, List } from '@ui-kitten/components';

import { getIconApi } from "../api/OpenWeather.js"
import PrintItemHourly from '../modules/itemsHourly.js';
import PrintItemDaily from '../modules/itemsDaily.js';

import moment from 'moment';
import 'moment/locale/fr';
import { ScrollView } from 'react-native-gesture-handler';

moment.locale('fr');


const WeatherDetails = ({weatherToLocation, func, refreshing}) =>{
    if (refreshing) {
        console.log("refresing");
    }
    const day = (dt) => {
        return moment(dt * 1000).format('dddd');
    }
    return(
        <Layout style={styles.container}>
            <Divider/>
            <Layout style={{flex:1}}>
                <ScrollView 
                    contentContainerStyle={{flex:1, flexDirection:"column", justifyContent:"center"}}
                    refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={()=>func()}
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
                            <Text>{weatherToLocation.current.weather[0].description}</Text>
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