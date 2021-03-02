const API_KEY = "2a2cff91f9bf4cbea582554582bbd2b7";

const COUNTRYCODE = "ca,us,fr,de,it,lu,gb,uk,fi,es,za,ru,pt,mt,rm,in,br,ar,hr,mx,ro,sn";

export const searchLocation = async (address, countrycode) => {
    let ccode = countrycode === "all" ? COUNTRYCODE : countrycode;
    //console.log(ccode);
    const requestUrl = `https://api.opencagedata.com/geocode/v1/json?q=${address}&key=${API_KEY}&language=fr&pretty=1&limit=10&no_dedupe=1&abbrv=1&countrycode=${ccode}`;
    const response = await fetch(requestUrl).catch((error)=>{return "failed call api openCage !"});
    const responseInJson = await response.json().catch((error)=>{return "Response Api OpenCage: failed to parse response in json!"})
    //console.log(Object.keys(responseInJson.results[0]));
    return responseInJson;   
}

export const getLocationWithGeocode = async ({lat, lng}) => {

    const requestUrl = `https://api.opencagedata.com/geocode/v1/json?q=${lat}%2C%${lng}&key=${API_KEY}&language=fr&pretty=1`;
    const response = await fetch(requestUrl).catch((error)=>{return "failed call api openCage (lat, lng)!"});
    const responseInJson = await response.json().catch((error)=> {return "Response Api openCage: from lat & lng !"});

    return responseInJson;
}