import Axios, {AxiosResponse, AxiosError} from "axios";
import { FormSettings } from './settings';
import {SubmissionRecord} from "./SubmissionRecord";
import { uploadFile } from './upload';
import {SubmissionResponse } from './responses';


export interface IDockAPI
{
    postForm(sr:SubmissionRecord):Promise<SubmissionResponse>
    uploadFile(file:File, field_name:string):Promise<string>
}

export class DockAPI implements IDockAPI
{
    private dockFormURL:string="";
    private token:string="";
    
    constructor(private dockFormID:string)
    {
        if(process.env.NODE_ENV == "production")
        {
            this.dockFormURL = "https://api.dockform.com";
        }
        else
        {
            this.dockFormURL = "http://localhost:3121";
        }
    }
    
    
    async loadFormSettings(prev_token:string|null, isPartial:boolean)
    {
        let p = new Promise<FormSettings>((resolve, reject)=>
        {
            const strUrl = this.dockFormURL+"/v1.0/form/"+this.dockFormID+"/token";
            
            Axios.post(strUrl, {
                token: prev_token,
                partial: isPartial?"y": undefined
            }).then((resp:AxiosResponse)=>
            {
                const settings:FormSettings = resp.data;
                this.token = settings.token
                resolve(settings)
            }).catch((err:AxiosError)=>{
                reject(err)
            })
        })
        return p
    }
    
    
    async postFormSettings(fs: Object)
    {
        const url = this.dockFormURL+"/v1.0/form/"+this.dockFormID+"/init";
        await Axios.post(url,fs);
        return true;
    }
    
    async postForm(sr:SubmissionRecord)
    {
        let p = new Promise<SubmissionResponse>((resolve, reject)=>
        {
            const url = this.dockFormURL+"/v1.0/form/"+this.dockFormID+"/submission";

            Axios.post(url,sr).then((resp:AxiosResponse)=>{
                const tu:SubmissionResponse = resp.data
                resolve(tu)
            }).catch((e:AxiosError)=>{
                reject(e)
            })
        })
        
        return p;
    }
    
    async uploadFile(file:File, field_name:string):Promise<string>
    {
        const endpoint = this.dockFormURL+ "/upload/";
        return uploadFile(endpoint,this.dockFormID,this.token,field_name, file)
    }
    
    async commitSubmission(token:string)
    {
        let p = new Promise<SubmissionResponse>((resolve, reject)=>
        {
           // const url = this.dockFormURL+"/s/commit/form"
           const url = this.dockFormURL+"/v1.0/form/"+this.dockFormID+"/submission:commit";

            Axios.post(url,{form_id:this.dockFormID, token}).then((resp:AxiosResponse)=>{
                const tu:SubmissionResponse = resp.data
                resolve(tu)
            }).catch((e:AxiosError)=>{
                reject(e)
            })
        })
        
        return p;
    }
    
    async MarkPaymentStatus(submission_id:string)
    {
        let p = new Promise<SubmissionResponse>((resolve, reject)=>
        {
           // const url = this.dockFormURL+"/s/commit/form"
           const url = this.dockFormURL+"/v1.0/form/"+this.dockFormID+"/payment:response";

            Axios.post(url,{submission_id}).then((resp:AxiosResponse)=>{
                const tu:SubmissionResponse = resp.data
                resolve(tu)
            }).catch((e:AxiosError)=>{
                reject(e)
            })
        })
        
        return p;
    }
    
}