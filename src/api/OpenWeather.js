const API_KEY = '1c2e6e5ef7183ef70f8f1a8c849ed057';

export const getWeather = async (lat, lon, lang='fr') =>{
    const requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&lang=${lang}&units=metric&appid=${API_KEY}`;
    //console.log(requestUrl + " type: "+ typeof requestUrl);
    const response = await fetch(requestUrl).catch((error)=>{return "failed call api openWeather !"});
    const responseInJson = await response.json().catch((error)=>{return "failed to parse response in json!"})
    //console.log(Object.keys(responseInJson));
    return responseInJson;
}

export const getIconApi = (icon) => {
    const uriIcon = 'http://openweathermap.org/img/wn/'+icon+'@2x.png';
    return uriIcon;
}