import { Location } from '../api/SubmissionRecord';
import Axios, {AxiosResponse, AxiosError} from "axios";

export async function getLocation(){
    let p = new Promise<Location>((resolve, reject)=>
    {
        //const url = "https://blip.runway7.net/";
        const url = "https://loc.ratufa.io/";
        
        Axios.get(url).then((resp:AxiosResponse)=>
        {
            console.log("location response ", resp.data)
            const loc:Location={
                country : resp.data.country,
                region : resp.data.region,
                city : resp.data.city,
                latlong : resp.data.latLong,
            };
            
            resolve(loc)
        }).catch((err:AxiosError)=>{
            reject(err)
        })
    })
    return p
}