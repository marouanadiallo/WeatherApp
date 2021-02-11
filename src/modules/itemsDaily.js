import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Divider, Layout, Text } from '@ui-kitten/components';

import moment from 'moment';
import {getIconApi } from '../api/OpenWeather.js';

const PrintItemDaily = ({ item }) =>{

    const day = (dt) => {
        return moment(dt * 1000).format('dddd');
    }
    const date = (dt) => {
        return moment(dt * 1000).format('D MMM');
    }
    return(
        <Layout>
            <Layout style={styles.container}>
                <Layout style={styles.day_date}>
                    <Text style={{marginRight:5}}>{day(item.dt)}</Text>
                    <Text>{date(item.dt)}</Text>
                </Layout>
                <Layout style={styles.sectionIcon}>
                    <Image source={{uri:getIconApi(item.weather[0].icon)}} style={{ width: 30, height: 30 }}/>
                    <Text style={{fontSize:10}}>{item.weather[0].description}</Text>
                </Layout>
                <Text style={styles.tmp}>{Math.round(item.temp.max)}°/{Math.round(item.temp.min)}</Text>
            </Layout>
            <Divider/>
        </Layout>
    );
}

export default PrintItemDaily;

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingVertical:5
    },
    day_date:{
        flex:1,
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems: "center"
    },
    sectionIcon:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    tmp:{
        flex:1, 
        textAlign:"right",
        //borderWidth:1,
        //borderColor:"red"
    }
})