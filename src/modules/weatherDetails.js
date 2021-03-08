import React from 'react';
import { Image, View, StyleSheet, RefreshControl, ScrollView, useWindowDimensions, Dimensions } from 'react-native';
import { Divider, Layout, Text, List, Button, Modal, Card, useTheme } from '@ui-kitten/components';

import { getIconApi } from "../api/OpenWeather.js"
import PrintItemHourly from '../modules/itemsHourly.js';
import PrintItemDaily from '../modules/itemsDaily.js';
import {FavIcon, FavIconOutline, AlertIcon, CloseIcon } from '../modules/load-Icons.js';

import {LineChart} from "react-native-chart-kit";

import moment from 'moment';
import 'moment/locale/fr';
import CircleChart from './circleChart.js'


moment.locale('fr');

const windDirection = 
    [
        {direction:'Nord', deg:[0]},
        {direction: 'Nord-Nord-est', deg:[0, 45]},
        {direction:'Nord-est', deg:[45]},
        {direction:'Est-Nord-est', deg:[45, 90]},
        {direction:'Est', deg:[90]},
        {direction:'Est-Sud-est', deg:[90, 135]},
        {direction:'Sud-est', deg:[15]},
        {direction:'Sud-Sud-est', deg:[135, 180]},
        {direction:'Sud', deg:[80]},
        {direction:'Sud-Sud-ouest', deg:[180, 225]},
        {direction:'Sud-ouest', deg:[25]},
        {direction:'Ouest-Sud-ouest', deg:[255, 270]},
        {direction:'Ouest', deg:[70]},
        {direction:'Ouest-Nord-ouest', deg:[270, 315]},
        {direction:'Nord-ouest', deg:[35]},
        {direction:'Nord-Nord-ouest', deg:[315, 338]}
    ];

const WeatherDetails = ({weatherToLocation, callback_func_Refreshing, refreshing, isFavorite=null, func_toggle_fav=null}) =>{
    //if (refreshing) {
        //  console.log("refresing");
        // }
    const [visible, setVisible] = React.useState(false);
    const windows =  useWindowDimensions();
    const theme = useTheme();

    const day = (dt) => {
        let day = moment(dt * 1000).format('dddd');
        day = day.charAt(0).toUpperCase() + day.slice(1);
        return day;
    }
    //console.log(Object.keys(weatherToLocation));

    const renderItemHeader = (headerProps, info) => (
        <View {...headerProps}>
          <Text category='h6'>
            {info.event}
          </Text>
        </View>
      );
    
      const renderItemFooter = (footerProps, info) => (
        <Text {...footerProps}>
            By {info.sender_name}
        </Text>
      );
    const renderItem = ({ item, index }) => (
        <Card
            style={styles.item}
            status='basic'
            header={headerProps => renderItemHeader(headerProps, item)}
            footer={footerProps=>renderItemFooter(footerProps, item)}>
            <Text>
                {item.description}
            </Text>
        </Card>
    );
    
    const getDirection = (degre) => {
        for (let index = 0; index < windDirection.length; index++) {
            const element = windDirection[index];
            if (element.deg.length>1) {
                if(element.deg[0] < degre && element.deg[1] > degre){
                    return element.direction;
                }
            }
            else{
                if(element.deg[0] === degre)
                    return element.direction;
            }
            
        }
    }
    const getHourlies = () =>{
        let tab = [];
        for (let index = 0; index < weatherToLocation.hourly.length/8; index++) {
            tab.push(moment(weatherToLocation.hourly[index].dt * 1000).format('LT'))
        }
        //console.log(tab);
        return tab;
    }

    const getVaryingAccordingHumidity = () =>{
        let tab = [];
        for (let index = 0; index < weatherToLocation.hourly.length/8; index++) {
            tab.push(Math.round(weatherToLocation.hourly[index].dew_point));
        }
        return tab;
    }
    return(
        <Layout style={{flex:1}}>
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
                        data={weatherToLocation.hourly.slice(1)}
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
                            data={weatherToLocation.daily.slice(1)}
                            renderItem ={({item})=>( 
                            <PrintItemDaily item={item}/>
                            )}
                        />   
                    </Layout>
                    <Divider/>
                    <Layout style={{flex:1, paddingHorizontal: 10 }}>
                        <Layout style={{ flex: 1, paddingVertical: 10, marginTop:10, marginBottom:20}}>
                                <Text category="h6" style={{flex:1, paddingVertical:10}}>NIVEAU DE CONFORT</Text>
                                <Layout style={{ flex: 1, flexDirection:"row" ,justifyContent:"center"}}>
                                    <Layout style={{flex: 1, justifyContent:"center", alignItems:'center'}}>
                                        <Text style={{paddingBottom:5}}>Humidité</Text>
                                        <Layout style={{marginRight:10}}>
                                            <CircleChart percentage={weatherToLocation.current.humidity}/>
                                        </Layout>
                                    </Layout>
                                
                                    <Layout style={{flex:2, flexDirection:'row',
                                                    justifyContent:'flex-start', alignItems:'stretch'}}
                                    >
                                        <Layout style={{justifyContent:'center', padding:5}}>
                                            <Text style={{opacity:0.7,marginBottom:10}}>Ressenti</Text>
                                            <Text style={{opacity:0.7}}>Indice UV</Text>
                                        </Layout>
                                    <Layout style={{justifyContent:'center', padding:5, marginLeft:30}}>
                                        <Text style={{marginBottom:10}}>{Math.round(weatherToLocation.current.feels_like)}°</Text>
                                        <Text>{weatherToLocation.current.uvi} Bas</Text>
                                    </Layout>
                                    </Layout>
                                </Layout>
                        </Layout>
                        <Divider/>
                        <Layout style={{flex: 1, paddingBottom:10}}>
                            <Text category="h6" style={{paddingVertical:10}}>VENT</Text>
                            <Layout style={{flexDirection:'row'}}>
                                <Layout style={{flex: 1, justifyContent:"center", alignItems:'center', marginRight:10}}>
                                    <Image source={require('../../assets/eolienne.gif')}
                                        style={{width:100, height:100}}
                                    />
                                </Layout>
                                <Layout 
                                    style={{flex:2, flexDirection:'row',
                                    justifyContent:'flex-start', alignItems:'stretch'}}
                                >
                                        <Layout style={{justifyContent:'center', padding:5}}>
                                            <Text style={{opacity:0.7,marginBottom:10}}>Direction</Text>
                                            <Text style={{opacity:0.7}}>Vitesse</Text>
                                        </Layout>
                                    <Layout style={{justifyContent:'center', padding:5, marginLeft:30}}>
                                        <Text style={{marginBottom:10}}>{getDirection(Math.round(weatherToLocation.current.wind_deg))} </Text>
                                        <Text>{Math.round(weatherToLocation.current.wind_speed)} m/s</Text>
                                    </Layout>
                                </Layout>
                            </Layout>
                        
                        </Layout>
                        <Divider/>
                        <Layout style={{flex:1, paddingVertical:20}}>
                            <Text category="h6" style={{paddingTop:10}} >TEMPERATURE ATMOSPHERIQUE</Text>
                            <Layout style={{marginRight:5}}>
                                <LineChart
                                    data={{
                                    labels: getHourlies(),
                                    datasets: [
                                        {
                                        data: getVaryingAccordingHumidity()
                                        }
                                    ]
                                    }}
                                    width={Dimensions.get("window").width} // from react-native
                                    height={220}
                                    yAxisSuffix="°"
                                    yAxisInterval={1} // optional, defaults to 1
                                    chartConfig={{
                                    backgroundColor: "blue",
                                    backgroundGradientFrom: theme['color-primary-500'],
                                    backgroundGradientTo: theme['color-primary-500'],
                                    decimalPlaces: 2, // optional, defaults to 2dp
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    style: {
                                        borderRadius: 16
                                    },
                                    propsForDots: {
                                        r: "6",
                                        strokeWidth: "2",
                                        stroke: "#CA4C37",
                                        fill: "#EC6E4C"
                                    }
                                    }}
                                    bezier
                                    style={{
                                    marginVertical: 8,
                                    marginRight:15,
                                    borderRadius: 16
                                    }}
                                />
                                <Text style={{paddingLeft:10, fontStyle:"italic", textAlign:"justify"}}>
                                    Variant en fonction de la pression et de l'humidité,
                                    en dessous de laquelle les gouttelettes d'eau commencent à se condenser et la rosée peut se former.
                                </Text>
                            </Layout>
                        </Layout>
                        <Divider/>
                        <Layout style={{flex:1, paddingVertical:20}}>
                            <Text category="h6">LEVERR ET COUCHER DE SOLEIL</Text>
                            <Layout style={{ borderColor:'#EC6E4C', borderBottomWidth:1, 
                                alignSelf:'center',height: windows.width/6,
                                width:windows.width/2 ,
                                flexDirection:'row', overflow: 'hidden', 
                                justifyContent:'center', alignItems:"flex-start",

                            }}
                            >
                                <CircleChart
                                    radius={windows.width/4}
                                    color={'#CA4C37'}
                                    fill={'#EC6E4C'}   
                                />
                            </Layout>
                            <Layout style={{
                                width:windows.width/2 ,
                                alignSelf: 'center',
                                flexDirection:'row',
                                justifyContent:'space-between'
                            }}>
                                <Text>{moment(weatherToLocation.current.sunrise * 1000).format('LT')}</Text>
                                <Text>{moment(weatherToLocation.current.sunset * 1000).format('LT')}</Text>
                            </Layout>
                        </Layout>
                    </Layout>
                </Layout>
            </ScrollView>
            <Layout style={[styles.btnMore]}>
                <Button style={{borderRadius:50}}  status='warning' accessoryLeft={AlertIcon} onPress={() => setVisible(true)}/>
                <Text  style={[styles.nbAlerts]}>
                    {
                        Object.keys(weatherToLocation).includes('alerts') ?
                        (weatherToLocation.alerts.length):(0)
                    }
                </Text>
                <Modal
                    visible={visible}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => setVisible(false)}>
                    <Layout disabled={true} style={{flexDirection:'column', width: windows.width, height: windows.height/3}}>
                        <Layout style={{flex:2,padding:10}}>
                            <Text category="h2" 
                                style={{marginBottom:5, borderBottomColor: '#ddd', borderBottomWidth: 1, opacity:0.5}}
                            >Alertes</Text>
                            {
                                Object.keys(weatherToLocation).includes('alerts') ?
                                (
                                     <List
                                        data={weatherToLocation.alerts}
                                        contentContainerStyle={styles.contentContainer}
                                        ItemSeparatorComponent={Divider}
                                        renderItem={renderItem}
                                    />
                                ):(
                                    <Text style={{color:theme['color-info-500']}}>Aucune alerte pour le moment</Text>
                                )
                            }
                        </Layout>
                        <Divider/>
                        <Layout style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                            <Button appearance='ghost' status='danger' accessoryLeft={CloseIcon} onPress={() => setVisible(false)}>
                                Fermer
                            </Button>
                        </Layout>
                    </Layout>
                </Modal>

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
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    },
    btnMore:{
        position: 'absolute',
        width:60, height: 50,
        bottom:10,
        right:20,
        borderRadius:50
        //borderWidth: 1,
        //borderRadius: 50
    },
    nbAlerts:{
        position:'absolute',
        top: -2,
        right:18,
        color:'white'
    },
    item: {
        marginVertical: 4,
    },
    contentContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
});
