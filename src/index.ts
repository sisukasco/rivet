import $ from "@sisukas/jquery";
import {Ratufa} from "./Ratufa";
import {SubmissionRecord} from "./api/SubmissionRecord";

declare global {
    interface Window { Ratufa: Ratufa|null; }
}

window.Ratufa = null;


$(function(){
    console.log("loading Ratufa ...")
    window.Ratufa = new Ratufa();
    if(!window.Ratufa.isMute())
    {
        console.log("Ratufa is not on mute")
        window.Ratufa.load();    
    }
})

export {
    Ratufa,
    SubmissionRecord
}