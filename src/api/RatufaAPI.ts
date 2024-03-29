import Axios, {AxiosResponse, AxiosError} from "axios";
import { FormSettings } from './settings';
import {SubmissionRecord} from "./SubmissionRecord";
import { uploadFile } from './upload';
import {SubmissionResponse } from './responses';


export interface IRatufaAPI
{
    postForm(sr:SubmissionRecord):Promise<SubmissionResponse>
    uploadFile(file:File, field_name:string):Promise<string>
}

export class RatufaAPI implements IRatufaAPI
{
    private ratufaURL:string="";
    private token:string="";
    
    constructor(
        private ratufaFormID:string, 
        private nodeDomain:string
        )
    {

        if(this.nodeDomain)
        {
            let proto = "https:"
            if(this.nodeDomain.includes("localhost")){
                proto = "http:"
            }
            this.ratufaURL = proto + "//" + this.nodeDomain;
        }else{
            if(window.location.hostname.includes("localhost")){
                this.ratufaURL = "http://localhost:3121";
            }else{
                this.ratufaURL = "https://api.ratufa.io";
            }
        }
        console.log("Ratufa URL ", this.ratufaURL)
    }
    
    
    async loadFormSettings(prev_token:string|null, isPartial:boolean)
    {
        let p = new Promise<FormSettings>((resolve, reject)=>
        {
            const strUrl = this.ratufaURL+"/v1.0/form/"+this.ratufaFormID+"/token";
            
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
        const url = this.ratufaURL+"/v1.0/form/"+this.ratufaFormID+"/init";
        return Axios.post(url,fs).catch((e)=>{
            if(e.response && e.response.data.msg){
                throw new Error(e.response.status+" "+e.response.statusText+": "+e.response.data.msg)
            }else{
                throw new Error("Error initing the form with Ratufa")
            }
        });
    }
    
    async postForm(sr:SubmissionRecord)
    {
        let p = new Promise<SubmissionResponse>((resolve, reject)=>
        {
            const url = this.ratufaURL+"/v1.0/form/"+this.ratufaFormID+"/submission";

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
        const endpoint = this.ratufaURL+ "/upload/";
        return uploadFile(endpoint,this.ratufaFormID,this.token,field_name, file)
    }
    
    async commitSubmission(token:string)
    {
        let p = new Promise<SubmissionResponse>((resolve, reject)=>
        {
           // const url = this.ratufaURL+"/s/commit/form"
           const url = this.ratufaURL+"/v1.0/form/"+this.ratufaFormID+"/submission:commit";

            Axios.post(url,{form_id:this.ratufaFormID, token}).then((resp:AxiosResponse)=>{
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
           // const url = this.ratufaURL+"/s/commit/form"
           const url = this.ratufaURL+"/v1.0/form/"+this.ratufaFormID+"/payment:response";

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