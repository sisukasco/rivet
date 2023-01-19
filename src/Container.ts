import {Ratufa} from "./Ratufa";
import { getScriptTagURL , LoadParams} from "./FormLoader";

export class RatufaContainer 
{
    public connectors:Ratufa[]=[]
    public loadFromURL(){
        if(!this.isMute())
        {
            var ratufa = new Ratufa();
            ratufa.load(undefined);    
            this.connectors.push(ratufa)
        }
    }
    public loadForm(params:LoadParams){
        var ratufa = new Ratufa();
        ratufa.load(params)
        this.connectors.push(ratufa)
    }

    /**
     ** mute=y means don't throw errors even when there are no parametes in the script
     ** May be the object instantiation comes later
     * 
     */
    public isMute()
    {
        let url = getScriptTagURL()
        if( false === url ){
            return false
        }
        
        if(url.query.mute && url.query.mute == "y"){
            return true
        }
        return false
    }
   
}