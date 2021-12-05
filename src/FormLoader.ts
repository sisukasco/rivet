import {parseUrl} from "query-string";
import $ from "@sisukas/jquery"

export class FormLoader
{
    public error=""
    public ratufaFormID=""
    public clientFormID=""
    public nodeDomain=""
    public partialStatus="none"
    public form:HTMLFormElement|null=null
    
    public getScriptTagURL()
    {
        let src = $("#ratufa_loader").attr('src')
        if(!src)
        {
            this.error = `Couldn't get the parameters for accessing the form. You have to copy and paste the script tag correctly`;
            return false;
        }
        return parseUrl(src)
    }
    public collectScriptTagParams():Boolean
    {
        let parsedUrl = this.getScriptTagURL()
        
        if( false === parsedUrl ){
            return false
        }
        
        if(!parsedUrl.query.f)
        {
            this.error =  `Couldn't get the ID of the form. You have to copy and paste the script tag correctly`;
            return false;            
        }
        
        if(typeof parsedUrl.query.f != "string")
        {
            this.error = `The Ratufa ID Parameter is incorrect. Please copy & paste the code correctly.`
            return false;
        }
        
        this.ratufaFormID = parsedUrl.query.f;
        
        if(parsedUrl.query.n)
        {
            if(typeof parsedUrl.query.n == "string")
            {
                this.nodeDomain = parsedUrl.query.n;
            }
        }
        
        if(parsedUrl.query.i)
        {
            if(typeof parsedUrl.query.i != "string")
            {
                this.error = `The ID of the form is incorrect. Please copy & paste the code correctly.`
                return false;
            }
            this.clientFormID = parsedUrl.query.i;
        }
        
        if(parsedUrl.query.p)
        {
            if(typeof parsedUrl.query.p == "string")
            {
                if(parsedUrl.query.p == "pg"){
                    this.partialStatus="page"
                }else if(parsedUrl.query.p == "f"){
                    this.partialStatus="final"
                }
                
            }
        }
        return true;
    }
    private checkSimfaticForms()
    {
        if(null == this.form)
        {
            return null;
        }
        if($(this.form).hasClass("sfm_form"))
        {
            console.log("loader This form was generated using Simfatic Forms ");
            const vv = getGlobalProperties("Validator")
            console.log("loader - found validator ", vv)
            return true;
        }
        return false;
    }
    private getFormObject():boolean
    {
        if(this.clientFormID)
        {
            let $mf = $('form#'+this.clientFormID);
            if($mf.length <= 0)
            {
                this.error=`Could not get form with ID: "<code>${this.clientFormID}</code>".
                 <div>Please make sure that the ID is correct.</div>`;
                return false;
            }
            else if($mf.length > 1)
            {
                this.error=`There are more than one forms with the same form ID: ${this.clientFormID}`
                return false;
            }
            this.form = <HTMLFormElement>($mf[0])
            return true;
        }
        else
        {
            if($('form').length <= 0)
            {
                this.error =`Could not find any form in this page. 
                <div>( Hint: form should be enclosed within &lt;form&gt ... &lt;/form&gt tags. )</div>`;
                    
                return false;
            }
            else if($('form').length > 1)
            {
                this.error = `There are more than one forms in this page. 
                You have to mention the ID of the form to attach to.
                `
                return false;
            }
            else
            {
                this.form = <HTMLFormElement>($('form')[0])
                return true;
            }
        }
    }
    public loadForm():boolean
    {
        if(!this.collectScriptTagParams())
        {
            return false;
        }
        if(!this.getFormObject())
        {
            return false
        }
        
        this.checkSimfaticForms()
        
        return true;
    }
}

//From: https://stackoverflow.com/a/2226053
function getGlobalProperties(partial:string) {
    var global = window; // window for browser environments
    for (var prop in global) {
      if (prop.indexOf(partial) > 0) // check the presence
        return global[prop]
    }
    return null;
}