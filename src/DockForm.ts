import $ from "@sisukas/jquery"
import {FormLoader} from "./FormLoader"
import {parseFormSettings} from "@sisukas/form-parser";
import {FormSettings} from "./api/settings"
import {DockAPI, ComputedPayment} from "./api"
import {FormSubmissionHandler} from "./submission"
// @ts-ignore: TS6059: not under 'rootDir'
import thispackage from '../package.json'; 
import payment from "./payment";
import {Display} from "./display/Display";

const version = thispackage.version
export class DockForm 
{
    private display = new Display();
    private formSettings:FormSettings|null=null
    private dockFormID:string=""
    private api:DockAPI|null = null
    private form:HTMLFormElement|null=null;
    private submissionHandler:FormSubmissionHandler|null=null; 
    private version=version;
    
    public isMute()
    {
        const fl = new FormLoader()
        let url = fl.getScriptTagURL()
        if( false === url ){
            return false
        }
        
        if(url.query.mute && url.query.mute == "y"){
            return true
        }
        return false
    }
    
    public async load()
    {
        console.log("Dockform loader version ", this.version)
        this.display.load();
        const fl = new FormLoader()
        if(!fl.loadForm())
        {
            this.display.popup.showPopup(fl.error)
            return false;
        }
        this.form = fl.form
        this.form && this.display.setForm(this.form)
        
        this.dockFormID = fl.dockFormID
        if(this.form == null)
        {
            return false;
        }
        
        this.api = new DockAPI(this.dockFormID)
        
        {
            const presp = await payment.handleInProgressCase(this.dockFormID)
            if(presp)
            {
                return true;
            }    
        }
        
        const tokenField= fl.dockFormID+"_token"
        const prev_token = localStorage.getItem(tokenField);
        console.log("form loading: prev_token ", prev_token)
        
        const isPartial = (fl.partialStatus == "page" || fl.partialStatus == "final")
        
        if(isPartial){
            console.log("before loading settings. isPartial is true")
        }
        this.formSettings = await this.api.loadFormSettings(prev_token, 
                                    isPartial)
        
        console.log("received formsettings ", this.formSettings)
        if(this.formSettings && this.formSettings.token)
        {
            console.log("saving token ", this.formSettings.token)
            localStorage.setItem(tokenField, this.formSettings.token)
        }
        
        if(this.formSettings.override_validation_handling === true)
        {
            //Turn off browser's default validation handling 
            this.form.noValidate = true;    
        }
        
        if(this.formSettings.loader_token === "yes" )
        {
            let strfs = parseFormSettings(this.form);
            let fs = JSON.parse(strfs)
            
            fs.timezone = ''
            fs.source_url = window.location.href
            
            try{
                fs.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;    
            }catch(e){
                fs.timezone = ''
            }
            
            await this.api.postFormSettings(fs);
        }
        if(this.formSettings.payment_processor)
        {
            this.formSettings.payment_api_key &&
            payment.loadScripts(this.formSettings.payment_processor,
                this.formSettings.payment_api_key);
        }
        
        
        this.submissionHandler = new FormSubmissionHandler(this.form, 
            this.formSettings, this.api)
        
        console.log("Attaching to on submit ...")
        $(this.form).on("submit",  (e:Event) => this.onSubmit(e))
        
        this.submissionHandler.collectLocation()
        if(fl.partialStatus == "page")
        {
            this.submissionHandler.markPartial()
        }
        else if(fl.partialStatus == "final")
        {
            this.submissionHandler.markFinal()
        }
        return true;
    }
    
    public async commitSubmission(formID:string)
    {
        const tokenField= formID+"_token"
        const token = localStorage.getItem(tokenField);
        if(!token || token.length <= 0){
            return false
        }
        console.log("commit: got the token ", token)
        const api = new DockAPI(formID)
        const res = await api.commitSubmission(token)
        console.log("commitSubmission result ", res)
        return res
    }
    
    
    private async onSubmit(e:Event)
    {
        if(!this.form){ throw new Error("Form object is null!"); }
        
        e.preventDefault()
        
       /* const sfm_form_submitted = $("[type=hidden][name=sfm_form_submitted]", this.form).val()
        if(!sfm_form_submitted|| (''+sfm_form_submitted).length < 2){
            console.log("Form is not (final) submitted yet. passing this submission event")
            return true ;           
        }*/
        
        if(this.form.validator && 
           this.form.validator.validate && 
           !this.form.validator.validate())
        {
            console.log("The form had validator. Validator returned false. So not submitting")
            return false;
        }
        if(null == this.submissionHandler) { throw new Error("Submission handler is null!") }
        const res = await this.submissionHandler.submit(this.display)
        this.display.popup.hide()
        if(res.has_errors) 
        {
            if(res.errors != undefined && res.errors.length > 0)
            {
                this.display.popup.showPopup(this.errorList(res.errors))    
            }
            return false; 
        }
        else
        {
            /*console.log("Form's action attrib is ", this.form.action)
            if(this.form.action && this.form.action.length > 0)
            {
                this.form.submit()
                return false
            }*/
            let tu = null
            if(res.response?.type == "payment")
            {
                const pmnt = res.response as ComputedPayment
                this.api && payment.showPopup(this.dockFormID, pmnt, this.display, this.api)
            } 
            else
            {
                tu = res.response
                if(tu)
                {
                    this.display.displayThankYou(tu)    
                }
                else
                {
                    console.error("Thankyou page is empty in the response ")
                }
            }
        }
        return false
    }
    
    private errorList(errs:string[])
    {
        let ret=""
        for(let err of errs)
        {
            ret += "<li>"+err+"</li>"
        }
        return("<ul>"+ret+"</ul>")
    }
    
}