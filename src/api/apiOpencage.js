const API_KEY = "2a2cff91f9bf4cbea582554582bbd2b7";

export const searchLocation = async (address) => {
    const requestUrl = `https://api.opencagedata.com/geocode/v1/json?q=${address}&key=${API_KEY}&language=fr&pretty=1&limit=10&no_dedupe=1&abbrv=1&countrycode=ca,us,fr,de,it,lu,gb,fi,es,za,ru,pt,mt,rm,in,br,ar,hr,gf,mx,ro,sn`;
    const response = await fetch(requestUrl).catch((error)=>{return "failed call api openCage !"});
    const responseInJson = await response.json().catch((error)=>{return "Response Api OpenCage: failed to parse response in json!"})
    //console.log(Object.keys(responseInJson.results[0]));
    return responseInJson;
    
}