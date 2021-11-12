import {IDisplay} from "./IDisplay";
import $ from "@sisukas/jquery"
import Popup from "./popup"
import { SubmissionResponse, 
    ThankYouMessage, RedirectURL} from "../api"
    
export class Display implements IDisplay
{
    public popup =  new Popup();
    private form:HTMLFormElement|null=null;
    
    public load()
    {
        this.popup.init();
    }
    public setForm(form:HTMLFormElement)
    {
        this.form = form
    }
    public displayThankYou(resp:SubmissionResponse){
        console.log("Thank you page received ", resp)
        if(resp.type == "message")
        {
            const tu = resp as ThankYouMessage
            if(tu.display_style == "replace_form")
            {
                if(this.form != null)
                {
                    $(this.form).replaceWith(tu.message)    
                }
                else
                {
                    console.error("the form object is null When the response is received ")
                }
            }
            else
            {
                this.popup.showPopup(tu.message)
            }
        }
        else if(resp.type == "url" )
        {
            const tu = resp as RedirectURL
            if(tu.url.length > 0)
            {
                window.location.href = tu.url    
            }
        }
        else
        {
            console.error("couldn't process the form response ", resp)
        }
    }
}