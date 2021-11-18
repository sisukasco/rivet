
export type FileUpload={
    file_name:string,
    size:number,
    type: string,
    upload_id:string
}
export type SingleFormValue = string|boolean|number|FileUpload

export type FormValue = SingleFormValue | SingleFormValue[]

export type FormDataValues=
{
    [name:string]:FormValue
}

export type Location={
    country?:string,
    region?: string,
    city?:string,
    latlong?:string
}
type Client={
    source_url?:string,
}

type Trail={
    time_stamp : string,
    event: string
}

export class SubmissionRecord
{
    public signature="Ratufa";
    public version=1;
    public token:string="";
    public folder="inbox";
    public is_partial = false;
    
    public form_data:FormDataValues={};
    public location:Location={}
    public client:Client={}
    public audit_trail:Trail[]=[]
    constructor(){
        const d = new Date()
        this.audit_trail.push({
            time_stamp: d.toISOString(),
            event: "Form loaded in client browser"
        })
        this.client.source_url = window.location.href
    }
}