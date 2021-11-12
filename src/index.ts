import $ from "@sisukas/jquery";
import {DockForm} from "./DockForm";
import {SubmissionRecord} from "./api/SubmissionRecord";

declare global {
    interface Window { dockForm: DockForm|null; }
}

window.dockForm = null;


$(function(){
    console.log("loading dockForm ...")
    window.dockForm = new DockForm();
    if(!window.dockForm.isMute())
    {
        console.log("dockForm is not on mute")
        window.dockForm.load();    
    }
})

export {
    DockForm,
    SubmissionRecord
}