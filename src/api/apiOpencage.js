const API_KEY = "2a2cff91f9bf4cbea582554582bbd2b7";

export const searchLocation = async (address) => {
    const requestUrl = `https://api.opencagedata.com/geocode/v1/json?q=${address}&key=${API_KEY}&language=fr&pretty=1`;
    const response = await fetch(requestUrl).catch((error)=>{return "failed call api openCage !"});
    const responseInJson = await response.json().catch((error)=>{return "Response Api OpenCage: failed to parse response in json!"})
    //console.log(Object.keys(responseInJson.results[0]));
    return responseInJson;
    
}