
import {showPaymentPopup, addPaymentProcessorScript, handlePaymentInProgress} from "./PaymentHandler";
import {ComputedPayment,DockAPI} from "../api";
import {IDisplay} from "../display/IDisplay";

export default {
    showPopup(formID:string, 
        payment:ComputedPayment,
        display:IDisplay,
        api:DockAPI)
    {
        return showPaymentPopup(formID, payment,display,api)        
    },
    loadScripts(processor:string, api_key:string){
        return addPaymentProcessorScript(processor,api_key)
    },
    handleInProgressCase(formID:string){
        return handlePaymentInProgress(formID)
    }
}

