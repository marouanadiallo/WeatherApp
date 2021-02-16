import React, {useState} from 'react';
import { SafeAreaView, StyleSheet, Dimensions, View } from 'react-native';
import { List, Divider, Layout, TopNavigation, Text, TopNavigationAction,Select,SelectItem,IndexPath, Input, Button, Spinner, Modal, Card, ViewPager} from '@ui-kitten/components';
import { ThemeContext, toogleThemeIconFill, toogleThemeIconOutiline } from '../modules/theme-context';

import { BackIcon, SearchIcon, CloseIcon, ArrowUpwardIcon, ArrowDownwardIcon } from '../modules/load-Icons.js';

import { searchLocation } from '../api/apiOpencage.js'

import PrintResponseSearch from '../modules/responseSearch.js';

const data = [
    {"country":{"code":"all", "etat":"Tous les pays"}},
    {"country":{"code":"fr", "etat":"France"}},
    {"country":{"code":"us", "etat":"Etats unis"}},
    {"country":{"code":"it", "etat":"Italy"}},
];

const SearchScreen =  ({navigation}) => {
    const themeContext = React.useContext(ThemeContext);
    const [_address, setAddress] = useState('');
    const [arrayAddress, setArrayAddress] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [visibleModalHelp, setVisibleModalHelp] = useState(true);
    const [viewPageSelectedIndex, setViewPageSelectedIndex] = useState(0);
    const shouldLoadComponent = (index) => index === viewPageSelectedIndex;

    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
    const displayValue = data[selectedIndex.row];
    //console.log(displayValue.country.etat);

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

    const loadAddress = async (address) => {
        setAddress(address);
        setIsLoading(true); 
        //console.log(isLoading);
        if(_address !=="" &&  _address.length > 1)
        {
            try {
                const response = await searchLocation(address).catch((error)=>{console.log("Error calling api open cage !");})
                //console.log(response);
                if(response.results.length !== 0)
                { 
                               
                    setArrayAddress(response.results)
                    setIsLoading(false);
                }
            } catch (error) {
                console.log("Error to loading !");
            }
            setIsLoading(false);
        }
    }

    const cleanList = () =>{
        setAddress('');
        setArrayAddress([]);
    }

    const renderOption = ({country}) => {
        //console.log(country);
        return (
            <SelectItem title={country.etat} key={country.code}/>
        );
    }
    

    const renderItem = ({ item, index }) =>( <PrintResponseSearch result={item} navigation={navigation} />);

    return (
        <SafeAreaView  style={styles.container}>
            <TopNavigation title='Recherche' alignment='center' accessoryLeft={BackAction} accessoryRight={toogleTheme}/>
            <Divider/>
            <Layout style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'stretch', paddingVertical:15, paddingHorizontal:10 }}>     
                <Input
                    placeholder='Ville, Code postal, Département'
                    value={_address}
                    onChangeText={loadAddress}
                    accessoryRight={SearchIcon}
                />
               <Layout style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                   <Layout style={{flex:1}} level='1'>
                        <Select
                            
                            size='small'
                            placeholder='Pays'
                            value={displayValue.country.etat}
                            selectedIndex={selectedIndex}
                            onSelect={index => setSelectedIndex(index)}
                        >
                            {data.map(renderOption)}
                        </Select>
                   </Layout>
                   <Layout style={{flex:1}}>
                    {
                       isLoading ?
                       ( 
                           <Layout style={styles.loading_container}>
                               <Spinner size='small'/>
                           </Layout>
                       )
                        : null
                    }
                    </Layout>
                    <Layout style={{flex:1}}>
                        <Button appearance='ghost' status='info' accessoryRight={ArrowDownwardIcon}>
                            Liste des pays 
                        </Button>
                    </Layout>
               </Layout>
                <Divider/>
                <Layout style={{flex:1, marginTop:5}}>
                    <List
                        data={arrayAddress}
                        renderItem={renderItem}
                        extraData={arrayAddress}
                        showsVerticalScrollIndicator={false}
                    />
                   
                </Layout>
            </Layout>
            <Layout style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", paddingLeft:10}}>
                <Text style={{fontStyle:"italic", fontSize:13}}>Annuler la recherche</Text>
                <Button appearance='ghost' status='basic' accessoryLeft={CloseIcon} onPress={cleanList}/>
            </Layout>
            <Modal
                visible={visibleModalHelp}
                backdropStyle={styles.backdrop}
                onBackdropPress={() => setVisibleModalHelp(false)}>
                <Card disabled={true} style={{ maxHeight: Dimensions.get('screen').height/2}}>
                    <Text category="h5">Trouvé plus vite ce que vous chercher</Text>
                    <ViewPager
                        selectedIndex={viewPageSelectedIndex}
                        shouldLoadComponent={shouldLoadComponent}
                        onSelect={index => setViewPageSelectedIndex(index)}
                    >
                        <Layout
                            style={styles.tabViewpage}
                            level='2'
                        >
                            <Text category='h6'>USERS</Text>
                        </Layout>
                        <Layout
                            style={styles.tabViewpage}
                            level='2'
                        >
                            <Text category='h6'>TRANSACTIONS</Text>
                        </Layout>
                    </ViewPager>
                    <Layout style={{ flexDirection:"row", justifyContent:"flex-end"}}>
                        <Button onPress={() => setVisibleModalHelp(false)} appearance='ghost' status='basic' accessoryLeft={CloseIcon}>
                            Fermer
                        </Button>
                    </Layout>
                </Card>
            </Modal>
        </SafeAreaView>
    );
}

export default SearchScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    select: {
        marginVertical: 2,
    },
    loading_container: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    tabViewpage: {
        paddingVertical:10,
        marginVertical:10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});