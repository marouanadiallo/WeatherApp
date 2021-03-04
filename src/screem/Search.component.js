import React, {useState, useEffect} from 'react';
import { SafeAreaView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme, CheckBox, List, Divider, Layout, TopNavigation, Text, TopNavigationAction,Select,SelectItem,IndexPath, Input, Icon, Button, Spinner, Modal, Card, ViewPager} from '@ui-kitten/components';
import { ThemeContext, toogleThemeIconFill, toogleThemeIconOutiline } from '../modules/theme-context';
import { connect } from 'react-redux';

import { BackIcon,  HelpIcon } from '../modules/load-Icons.js';

import { searchLocation, getLocationWithGeocode  } from '../api/apiOpencage.js'

import PrintResponseSearch from '../modules/responseSearch.js';

const data = [
    {"country":{"code":"all", "etat":"Tous les pays"}},
    {"country":{"code":"uk,gb", "etat":"Angleterre"}},
    {"country":{"code":"za", "etat":"Afrique du sud"}},
    {"country":{"code":"de", "etat":"Allemangne"}},
    {"country":{"code":"ar", "etat":"Argentine"}},
    {"country":{"code":"br", "etat":"Brezil"}},
    {"country":{"code":"ca", "etat":"Canada"}},
    {"country":{"code":"hr", "etat":"Croatie"}},
    {"country":{"code":"es", "etat":"Espagne"}},
    {"country":{"code":"us", "etat":"Etats unis"}},
    {"country":{"code":"fi", "etat":"Finland"}},
    {"country":{"code":"fr", "etat":"France"}},
    {"country":{"code":"in", "etat":"Inde"}},
    {"country":{"code":"it", "etat":"Italie"}},
    {"country":{"code":"lu", "etat":"Luxembourg"}},
    {"country":{"code":"rm", "etat":"Madagascar"}},
    {"country":{"code":"mt", "etat":"Malte"}},
    {"country":{"code":"mx", "etat":"Mexic"}},
    {"country":{"code":"pt", "etat":"Portugal"}},
    {"country":{"code":"ro", "etat":"Romanie"}},
    {"country":{"code":"ru", "etat":"Russe"}},
    {"country":{"code":"sn", "etat":"Sénégal"}},
];

const SearchScreen =  ({navigation, dispatch, aboutModal, favorites}) => {

    const themeContext = React.useContext(ThemeContext);
    const [_address, setAddress] = useState('');
    const [arrayAddress, setArrayAddress] = useState([]);
    const [arrayFav, setarrayFav] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [toggleIconInput, setToggleIconInput] = useState(false);
    const [visibleModalHelp, setVisibleModalHelp] = useState(aboutModal.haveToOpen);
    const [viewPageSelectedIndex, setViewPageSelectedIndex] = useState(0);
    const [notFound, setNotFound] = useState(false);

    const [activeChecked, setActiveChecked] = useState(aboutModal.checked);

    const shouldLoadComponent = (index) => index === viewPageSelectedIndex;

    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
    
    const displayValue = data[selectedIndex.row];
    
    
    const theme = useTheme();

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
    
    useEffect(()=>{
        loadAddress(_address);
    }, [selectedIndex]);

    useEffect(()=>{
        if(favorites.length != 0){
            favorites.forEach(element => {
                const {latitude, longitude} = element.geocode; 
                loadFav({latitude,longitude});
            });
        }
    }, []);

    const toggleOpenHelpModal= () => {
        //console.log("toggle open");
        const action = { type: "TOGGLE_OPEN", value:{ isActive: activeChecked ? false : true, checked: activeChecked }}
        dispatch(action);
    }

    const loadFav = async ({lat, lng}) =>{
        try {
            const response = await getLocationWithGeocode({lat, lng});
            setarrayFav(arrayFav, ...response.results)
        } catch (error) {
            console.log("error !");
        }
    }
    const loadAddress = async (address) => {
        setAddress(address);
        
        //console.log(isLoading);
        if(_address !=="" &&  _address.length > 1)
        {
            setIsLoading(true); 
            try {
                const response = await searchLocation(address, data[selectedIndex.row].country.code).catch((error)=>{console.log("Error calling api open cage !");})
                //console.log(response);
                if(response.results.length !== 0)
                { 
                    //response.results.forEach(e=>console.log(e.components._category))
                    const cities = response.results.filter(res => res.components._category ==="place" || res.components._category ==="postcode")

                    //console.log(cities);
                    setNotFound(cities.length == 0 ? true : false);       
                    //console.log(notFound);   
                    setArrayAddress(cities)
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
    const toogleInputIcon = (props) => (
        toggleIconInput ? (
            <TouchableOpacity onPress={cleanList} >
                <Icon {...props} name='close-outline' fill={theme['color-danger-500']}/>
            </TouchableOpacity>
        ):
        (<Icon {...props} name='search'/>)
    );
    
    //console.log(favorites);
    const renderItem = ({ item, index }) =>{
        let isFavorite;
        favorites.findIndex( elem => elem.geocode.latitude === item.geometry.lat && elem.geocode.longitude === item.geometry.lng ) !== -1 ?
        isFavorite = true : isFavorite = false;
       return( <PrintResponseSearch result={item} navigation={navigation} isFavorite={isFavorite}/>);
    };

    return (
        <SafeAreaView  style={styles.container}>
            <TopNavigation title='Recherche' alignment='center' accessoryLeft={BackAction} accessoryRight={toogleTheme}/>
            <Divider/>
            <Layout style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'stretch', paddingVertical:15, paddingHorizontal:10 }}>     
               <Layout>
                    <Input
                        placeholder='Ville, Code postal, Département'
                        value={_address}
                        onChangeText={loadAddress}
                        accessoryRight={toogleInputIcon}
                        onFocus={()=>setToggleIconInput(true)}
                        onBlur={()=>setToggleIconInput(false)}
                        onSubmitEditing={()=> loadAddress(_address)}
                    />
                </Layout>
               <Layout style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                   <Layout style={{flex:1}} level='1'>
                        <Select
                            size='small'
                            placeholder='Pays'
                            value={displayValue.country.etat}
                            selectedIndex={selectedIndex}
                            onSelect={index => {setSelectedIndex(index)}}
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
                    <Layout style={{flex:1, flexDirection:"row", justifyContent:"flex-end"}}>
                        <Button appearance='ghost' status='info' accessoryRight={HelpIcon} onPress={()=>{
                            setVisibleModalHelp(true); 
                        }}/>
                    </Layout>
               </Layout>
                <Divider/>
                <Layout style={{flex:1, marginTop:5}}>
                    {
                        notFound ? (
                            <Layout style={{justifyContent:"center", alignItems:"center"}}>
                                <Text style={{color:theme['color-info-500']}}>Aucun résultat, rassurez-vous d'avoir sélectionné le bon pays.</Text>
                            </Layout>
                        ): null
                    }
                    <List
                        data={arrayAddress}
                        extraData={arrayFav}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator = {false}
                    />
                   
                </Layout>
            </Layout>
                    <Modal
                        visible={visibleModalHelp}
                        backdropStyle={styles.backdrop}
                        onBackdropPress={() => setVisibleModalHelp(false)}
                    >
                        <Card disabled={true} style={{ maxHeight: Dimensions.get('screen').height/2}}>
                            <Text category="h4">Aide à la recherche</Text>
                            <Divider/>
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
                            <Layout style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                                <CheckBox
                                    style={styles.checkbox}
                                    status='info'
                                    checked={activeChecked}
                                    onChange={() => setActiveChecked(!activeChecked)}
                                >
                                    N'est plus affiché.
                                </CheckBox>
                                <Button onPress={() =>{
                                        setVisibleModalHelp(false);
                                        toggleOpenHelpModal();
                                    }} appearance='ghost' status='danger'>
                                    Fermer
                                </Button>
                            </Layout>
                        </Card>
                    </Modal>    
        </SafeAreaView>
    );
}
const mapStateToProps = state => {
    return {
       aboutModal: state.aboutModal.aboutModal,
       favorites: state.favorites.favorites
    }
  }
export default connect(mapStateToProps)(SearchScreen);

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
    checkbox: {
        fontSize:8
    },
});