import React, {useState, useEffect} from 'react';
import { Image, StyleSheet, TouchableOpacity  } from 'react-native';
import { Layout, Text, List, Divider } from '@ui-kitten/components';

import PrintItemHourly from '../modules/itemsHourly.js';
import {getWeather, getIconApi} from '../api/OpenWeather.js';
import { NotIcon} from '../modules/load-Icons.js';

const PrintResponseSearch = ({result}) => {
    const [weatherToLocation, setWeatToLocation] = useState([]);

   useEffect(()=>{
           if(result.components._type === "city" || result.components._type === "county" || result.components._type ==='postcode')
           {
               loadLocationWeather();
           }           
   }, [result]) 

   const loadLocationWeather = async () =>{
        try {
            const w = await getWeather(result.geometry.lat, result.geometry.lng);
            setWeatToLocation(w);
            //console.log(w);

        } catch (error) {
            console.log("echec !");
        }
   }
   
    return (
        weatherToLocation.length !== 0 ?
        (
        <TouchableOpacity style={styles.container}>
            <Layout style={styles.header}>
                <Layout>
                    {
                        result.formatted !== "undefined" && result.formatted.includes(',') ?
                        (
                            <Layout style={{justifyContent:"flex-start"}}>
                                <Text category="h6">{result.formatted.substring(0, result.formatted.indexOf(","))}</Text>
                                <Text>{result.components.country}, {result.components.county} </Text>
                            </Layout>
                        ):
                        (
                            <Layout>
                                <Text>{result.formatted}</Text>
                            </Layout>
                        )
                    }
                    
                </Layout>
                <Layout>
                    <Layout>
                        <Layout style={{justifyContent:"center", alignItems:"center"}}>
                            <Image source={{uri:getIconApi(weatherToLocation.current.weather[0].icon)}} style={{ width: 20, height: 20 }}/>
                            <Text>{Math.round(weatherToLocation.current.temp)}°</Text>
                            <Text>{weatherToLocation.current.weather[0].description}</Text>
                        </Layout>
                    </Layout>
                </Layout>
            </Layout>
            <Layout style={{paddingTop:3}}>
                <List
                    data={weatherToLocation.hourly}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem ={({item})=>(
                        <PrintItemHourly item={item}/>
                        )}
                />
            </Layout>
        </TouchableOpacity >): (<Divider/>)
    );
}

const styles = StyleSheet.create({
    container:{
        marginVertical:3,
        //borderWidth:
    },
    header:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    headerleft:{

    }
})

export default PrintResponseSearch;