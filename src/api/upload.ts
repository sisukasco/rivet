import {Upload} from "@sisukas/tus-js-client";

export function uploadFile(endPoint:string,formID:string,token:string,field_name:string, file:File):Promise<string> 
{
    let p = new Promise<string>((resolve, reject)=>{
        var upload = new Upload(file, {
            endpoint: endPoint,
            retryDelays: [0, 3000, 5000, 10000, 20000],
            
            metadata: {
                filename: file.name,
                filetype: file.type,
                FormID: formID,
                Token: token,
                Field: field_name,
                Uploader: "submission",
            },
            onError: function(error) {
                //console.log("Failed because: " + error)
                reject(error);
            },
            onProgress: function(bytesUploaded, bytesTotal) {
                var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
                console.log(bytesUploaded, bytesTotal, percentage + "%")
            },
            onSuccess: function() {
                if(upload.url == null){
                    throw new Error("upload.url is empty!")
                }
                const upldid = getParameterFromURL(upload.url)
                resolve(upldid)    
            }
        })
        upload.start()
    })
    return p;
}

export function getParameterFromURL(url:string)
{
    url = url.replace(/\/$/,"");//remove last / if any
    return url.substr(url.lastIndexOf("/") + 1);
}