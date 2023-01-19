import $ from "@sisukas/jquery";
import {Ratufa} from "./Ratufa";
import { RatufaContainer } from "./Container";
import {SubmissionRecord} from "./api/SubmissionRecord";

declare global {
    interface Window { 
        RatufaContainer: RatufaContainer|null; 
    }
}

window.RatufaContainer = new RatufaContainer();


$(function(){
    window.RatufaContainer?.loadFromURL()
})


export {
    Ratufa,
    SubmissionRecord
}