import {uploadFile, getParameterFromURL} from "../src/api/upload"
import faker from "faker"
import * as tus from "@sisukas/tus-js-client";
jest.mock('@sisukas/tus-js-client');

describe("upload-file",()=>{
    test("getting file id from url",async ()=>
    {
        expect(getParameterFromURL("http://website.com/pp1/pp2/param")).toEqual("param")
        expect(getParameterFromURL("/pp1/pp2/param")).toEqual("param")
        expect(getParameterFromURL("/pp1/pp2/12345")).toEqual("12345")
        expect(getParameterFromURL("12345")).toEqual("12345")
        expect(getParameterFromURL("http://website.com/param/")).toEqual("param")
    })
    test("simple file upload",async ()=>
    {
        const upldid = faker.random.word()
        let uploadObj={
            url: "http://www.cc/"+upldid,
            start(){}
        }
        //@ts-ignore
        tus.Upload.mockImplementation((f:any,opt:any)=>{
            setTimeout(()=>{
                opt.onSuccess()
            },100 ) 
            return uploadObj
        });
        
        const formID="myFormID"
        const filename = "hello.png"
        const testImageFile = new File(["hello"],filename , { type: "image/png" });
        const res = await uploadFile("http://website.com",formID, testImageFile)
        expect(res).toEqual(upldid)
    })
    
    test("file upload errors out",async ()=>
    {
        const upldid = faker.random.word()
        let uploadObj={
            url: "http://www.cc/"+upldid,
            start(){}
        }
        //@ts-ignore
        tus.Upload.mockImplementation((f:any,opt:any)=>{
            setTimeout(()=>{
                opt.onError("There was an error uploading the file")
            },100 ) 
            return uploadObj
        });
        
        const formID ="myFormID"
        const filename = "hello.png"
        const testImageFile = new File(["hello"],filename , { type: "image/png" });
        let err=null
        try{
            await uploadFile("http://website.com",formID, testImageFile)    
        }catch(e){
            err= e
        }
        expect(err).not.toBeNull()
        
    })
    
    
})
