import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';

import moment from 'moment';

import {getIconApi } from '../api/OpenWeather.js';
const PrintItemHourly = ({ item }) =>{

  const hours = (dt) => {
    return moment(dt * 1000).format('LT');
  }
    return(
      <Layout style={styles.container}>
        <Text>{hours(item.dt)}</Text>
        <Image source={{uri:getIconApi(item.weather[0].icon)}} style={{ width: 20, height: 20 }}/>
        <Text>{Math.round(`${item.temp}`)}°</Text>
      </Layout>
    );
}
export default PrintItemHourly;

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: "space-between",
    alignItems:"center",
    marginRight: 3,
    paddingVertical:10,
    paddingHorizontal:17
  },
  description:{
   fontSize:10
  }
})