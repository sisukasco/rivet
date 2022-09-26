import $ from "@sisukas/jquery";
import {Ratufa} from "./Ratufa";
import {SubmissionRecord} from "./api/SubmissionRecord";

declare global {
    interface Window { Ratufa: Ratufa|null; }
}

window.Ratufa = null;


$(function(){
    window.Ratufa = new Ratufa();
    if(!window.Ratufa.isMute())
    {
        window.Ratufa.load();    
    }
})

export {
    Ratufa,
    SubmissionRecord
}