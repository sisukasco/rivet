import $ from "@sisukas/jquery"
import {ComputedPayment, DockAPI} from "../../api";
import stripe_button from "./StripeButton.html";
import stripe_window from "./StripeWindow.html";
import {IDisplay} from "../../display/IDisplay";

declare global {
    interface Window {
        payment:ComputedPayment
        stripePaymentSuccessful():void
        formID: string
    }
    
}

export async function showStripeButton(formID:string, payment:ComputedPayment,
    display:IDisplay,
    api:DockAPI)
{
    display.popup.show({content: stripe_button});
    $("#dockform_stripe_button").on("click", ()=>
    {
        window.stripePaymentSuccessful=async ()=>
        {
            display.popup.hide();
            const resp = await api.MarkPaymentStatus(payment.submission_id)
            display.displayThankYou(resp);
            return;
        }
        const w =  window.open('', '_blank')
        w && (w.payment = payment) && (w.formID = formID)
        w?.document.write(stripe_window)
        w?.focus();
    })
    
}
    

    