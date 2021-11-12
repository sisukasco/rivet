import paypal_button from "./PaypalButton.html";
import {IDisplay} from "../../display/IDisplay";
import {ComputedPayment, DockAPI} from "../../api"

declare global {
    interface PaypalObject
    {
        render(s:string):void
    }
    interface Paypal {
        Buttons(p:any):PaypalObject
    }
    
}

declare var paypal:Paypal

export async function showPaypalButton(display:IDisplay, payment:ComputedPayment, api:DockAPI)
{
    display.popup.show({content: paypal_button});
    
    paypal.Buttons({
        style: {
        layout: 'horizontal',
        tagline: 'false'
        },
        createOrder: function(_data:any, actions:any) {
          return actions.order.create({
            purchase_units: [{
              amount: {
                currency_code:"USD",
                value: payment.amount.toString()
              }
            }],
            application_context:{
                shipping_preference:"NO_SHIPPING"
            }
          });
        },
        onApprove: function(_data:any, actions:any) {
          return actions.order.capture().then(async function(__details:any) {
            display.popup.hide();
            const resp = await api.MarkPaymentStatus(payment.submission_id)
           
            display.displayThankYou(resp);
            
            /*console.log("order details: id:%d status:%s email: %s name %s %s ",
              details.id, details.status, details.payer.email_address,
              details.payer.name.given_name, details.payer.name.surname)
              */
              //api.MarkPaymentStatus(payment.submission_id)
              // id
              // status: "COMPLETED"
              // payer.email_address
              // payer.name.given_name
              // payer.name.surname
              
            //alert('Transaction completed by ' + details.payer.name.given_name);
          });
        }
      }).render('#paypal-button-container');
}
