
import {FormElement} from "./FormElement"
import {FormDataValues, FileUpload} from "../api/SubmissionRecord"
import $ from "@sisukas/jquery";
import { IDockAPI } from '../api';
import {OpResult} from "./validate";

interface UploadExceptionInterface{
    getBody():string;
}
interface UploadException{
    originalResponse:UploadExceptionInterface
}
export type FileUploads ={
    [k:string]:File[]
}

type UploadedFile ={
    field:string
    upld:FileUpload|undefined
    error:string
}

export class FileUploadHandler
{
    public files: FileUploads={};
    constructor(form:HTMLFormElement)
    {
        this.attachToFileUploadFields(form)
    }
    public merge(fd:FormDataValues)
    {
        for(let field in this.files)
        {
            const uplds:FileUpload[] = []
            for(let f=0;f<this.files[field].length;f++)
            {
                const fi = this.files[field][f]
                const upld:FileUpload={
                    file_name: fi.name,
                    size: fi.size,
                    type: fi.type,
                    upload_id:""
                }
                uplds.push(upld)
            }
            if(uplds.length == 1)
            {
                fd[field] = uplds[0]    
            }
            else if(uplds.length > 1)
            {
                fd[field] = uplds
            }
        }
    }
    
    private attachFileDeleteEventHandler(ipname:string, ff: HTMLInputElement)
    {
        ff.addEventListener('file_delete', (e) => 
        {
            const ee = <any>e
            let fileinfo=null
            if(ee.detail && ee.detail.fileinfo)
            {
                fileinfo = ee.detail.fileinfo
            }
            else{
                return false
            }
            
            for(let f=0;f < this.files[ipname].length;f++)
            {
                const fi = this.files[ipname][f]
                if( fi.name == fileinfo.name &&
                    fi.size == fileinfo.size)
                {
                   this.files[ipname].splice(f,1);  
                   return true
                }
            }
            return false
        });
    }
    
    private attachToFileUploadFields(form:HTMLFormElement)
    {
        $("input[type='file']",form).each((_i:number,e:HTMLElement)=>{
            let ff = <HTMLInputElement>(e)
            const fe = new FormElement(ff)
            let ipname=fe.getName()
            
            this.attachFileDeleteEventHandler(ipname, ff);
            
            $(ff).on("change", ((fe:Event)=>{
                fe.target as HTMLInputElement
                let tt = fe.target as HTMLInputElement
                if (tt && tt.files && tt.files.length)
                {
                    for(let f=0;f<tt.files.length; f++)
                    {
                        let fi = tt.files.item(f)
                        
                        if(null != fi)
                        {
                            if(!this.files[ipname])
                            {
                                this.files[ipname] = []
                            }
                            this.files[ipname].push(fi)
                            //this.fileUploads.push(fi)    
                        }
                    }
                }
                
            }))
        })
    }
    
    public async uploadFiles(fd:FormDataValues, api:IDockAPI)
    {
        const promises:Promise<UploadedFile>[]=[]
        for(let field in this.files)
        {
            if(!fd[field])
            {
                continue;
            }
            for(let f=0;f < this.files[field].length; f++)
            {
                const fi = this.files[field][f]
                const prom = this.uploadOneFile(field,fi,api)
                promises.push(prom)
            }
        }
        const uplds = await Promise.all(promises)
        const result = new OpResult
        result.hasErrors = false

        for(let upld of uplds)
        {
            if(upld.error)
            {
                result.hasErrors = true 
                result.errors[upld.field]= {
                    message : upld.error
                }
                continue
            }
            if(upld.upld)
            {
                if(Array.isArray(fd[upld.field]))
                {
                    let farr = fd[upld.field] as FileUpload[]
                    for(let f=0;f < farr.length;f++)
                    {
                        if(farr[f]["file_name"] == upld.upld.file_name && 
                            farr[f]["size"] == upld.upld.size)
                        {
                            farr[f].upload_id = upld.upld.upload_id
                        }
                    }
                }
                else
                {
                    (fd[upld.field] as FileUpload).upload_id = upld.upld.upload_id
                }
            }
        }
        return result
    }
    
    private async uploadOneFile(field:string, fi:File , api:IDockAPI ){
        let upload_id=""
        try{
            upload_id = await api.uploadFile(fi, field)
        }catch(e){
            let err ="error cought in upload"
            if((<UploadException>e).originalResponse)
            {
                err =(<UploadException>e).originalResponse.getBody()    
            }else{
                err = String(e)
            }
            let ret:UploadedFile={
                field,
                upld:undefined,
                error:err
            }
            return ret
        }
        
        const upld:FileUpload={
            file_name: fi.name,
            size: fi.size,
            type: fi.type,
            upload_id: upload_id
        }
        let ret:UploadedFile={
            field,
            upld,
            error:""
        }
        return ret
    }
}