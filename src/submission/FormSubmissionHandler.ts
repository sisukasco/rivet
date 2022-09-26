import $ from "@sisukas/jquery"
import {FormDataCollector} from "./FormDataCollector"
import {FileUploadHandler} from "./FileUploadHandler"
import {FormSettings} from "../api/settings"
import {validateForm, showErrorsNextToElements, OpResult} from "./validate"
import {IRatufaAPI, SubmissionResponse} from "../api"
import {SubmissionRecord} from "../api/SubmissionRecord"
import {getLocation} from "./location"
import {IDisplay} from "../display/IDisplay";
export interface SubmissionResult
{
    has_errors:Boolean
    errors ?: string[],
    response?:SubmissionResponse
}

export class FormSubmissionHandler
{
    private uploadHandler:FileUploadHandler;
    private rec=new SubmissionRecord()
    
    constructor(private form:HTMLFormElement, 
        private settings:FormSettings,
        private api:IRatufaAPI)   
    {
        this.uploadHandler = new FileUploadHandler(form)
    }
    public markPartial()
    {
        this.rec.is_partial = true    
    }
    public markFinal()
    {
        this.rec.is_partial = false 
    }
    public async collectLocation()
    {
        try{
            this.rec.location = await getLocation()
        }catch(e){
            console.error("Error collecting client info ", e)
        }
    }
    
    public async submit(disp:IDisplay):Promise<SubmissionResult>
    {
        const fdc = new FormDataCollector(this.form)
        const fdd = fdc.getInputs()
        this.uploadHandler.merge(fdd)
        $(".ratufa-error", $(this.form)).remove();
        
        const v = validateForm(this.form, this.settings.fields, fdd)
        
        if(v !== true)
        {
            return({
                has_errors:true, 
                errors: v
            })
        }
        
        this.rec.token = this.settings.token
        
        disp.popup.showProgress()
        const upload_result = await this.uploadHandler.uploadFiles(fdd, this.api)
        if(upload_result.hasErrors)
        {
            disp.popup.hide()
            const other_errors = showErrorsNextToElements(this.form, upload_result.errors)
            return({
                has_errors:true, 
                errors: other_errors
            })
        }
        
        this.rec.form_data = fdd
        
        let sr:SubmissionResponse
        try{
            sr = await this.api.postForm(this.rec)  
        }catch(e){
            console.error("Submission handler received exception")
            return this.resolveSubmissionError(e)
        }
        
        return({has_errors:false, response: sr})
    }
    
    private resolveSubmissionError(e:any){
        if(e.response && e.response.data){
            let errobj = e.response.data
            let result = new OpResult
            
            for(let field in errobj){
                result.errors[field] = {
                    message :errobj[field]
                }
            }
            let other_errors = showErrorsNextToElements(this.form, result.errors)
            return({
                has_errors:true,
                errors: other_errors
            }) 
        }else{
            let error = "Error while submitting the form"
            if(e.message){
                error += e.message 
            }
            return({
                has_errors:true,
                errors: [error]
            }) 
        }
    }
}