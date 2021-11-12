import {ComputedPayment,DockAPI} from "../api";
import {showPaypalButton} from "./paypal/PaypalHandler";
import {showStripeButton} from "./stripe/StripeHandler";
import {IDisplay} from "../display/IDisplay";


export async function showPaymentPopup(formID:string, 
    payment:ComputedPayment,
    display:IDisplay,
    api:DockAPI)
{
    if(payment.processor == "stripe")
    {
        return showStripeButton(formID, payment,display, api) 
    }
    else if(payment.processor == "paypal")
    {
        return showPaypalButton(display, payment, api)
    }
}


export function addPaymentProcessorScript(processor:string, api_key:string)
{
    if(processor == "stripe")
    {
        return;
    }
    
    if(processor == "paypal")
    {
        const script_url = "https://www.paypal.com/sdk/js?client-id="+api_key;
        var script = document.createElement('script');
        script.src = script_url;
    
        document.head.appendChild(script); 
    }
}

export async function handlePaymentInProgress(formID:string)
{
    const key = "payment_"+formID
    const s = sessionStorage.getItem(key)
    if(!s)
    {
        return false;
    }
    sessionStorage.removeItem(key)
    
    const urlParams = new URLSearchParams(window.location.search);
    const pxstatus = urlParams.get('pxstatus');
    if(pxstatus == "success")
    {
        if(window &&  window.opener)
        {
            window.opener.focus();
            window.opener.stripePaymentSuccessful();
        }
    }
    window.close();
    
    return true
}