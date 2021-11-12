import $ from "@sisukas/jquery"
import userEvent from '@testing-library/user-event';
import {FileUploadHandler} from "../src/submission/FileUploadHandler";
import {FormDataCollector} from "../src/submission/FormDataCollector";
import {FileUpload} from "../src/api";


describe("upload-handler",()=>{
    test("select one file", async ()=>
    {
        document.body.innerHTML =`
        <form id="myform">
        <div class="form-group">
        <label for="photo_upload">Upload Photo</label>
        <input type="file" class="form-control-file" name="photo" id="photo_upload">
        </div>
        </form>
        ` 
        const form = <HTMLFormElement>$("#myform")[0]
        
        const uh = new FileUploadHandler(form)
        
        const fileInput = $("#photo_upload")[0]
        
        const filename = "hello.png"
        
        const testImageFile = new File(["hello"],filename , { type: "image/png" });
  
        await userEvent.upload(fileInput, testImageFile);
        
        expect(uh.files["photo"]).toBeDefined()
        expect(uh.files["photo"].length).toEqual(1)
        
        expect(uh.files["photo"][0].name).toEqual(filename)
    })
    
    test("select multiple files", async ()=>
    {
        document.body.innerHTML =`
        <form id="myform">
        <div class="form-group">
        <label for="photo_upload">Upload Photos</label>
        <input type="file" multiple class="form-control-file" name="photos" id="photo_upload">
        </div>
        </form>
        ` 
        const form = <HTMLFormElement>$("#myform")[0]
        
        const uh = new FileUploadHandler(form)
        
        const fileInput = $("#photo_upload")[0]
        
        const filename1 = "hello.png"
        
        const file1 = new File(["hello"],filename1 , { type: "image/png" });
        
        const filename2 = "hello.png"
        
        const file2 = new File(["hello"],filename2 , { type: "image/png" });
  
        await userEvent.upload(fileInput, [file1,file2]);
        
        expect(uh.files["photos"]).toBeDefined()
        expect(uh.files["photos"].length).toEqual(2)
        
    })
    
    test("multiple file upload fields", async ()=>
    {
        document.body.innerHTML =`
        <form id="myform">
        <div class="form-group">
        <label for="photo_upload">Upload Photos</label>
        <input type="file" class="form-control-file" name="photos" id="photo_upload1">
        <input type="file" class="form-control-file" name="photos" id="photo_upload2">
        </div>
        
        </form>
        ` 
        const form = <HTMLFormElement>$("#myform")[0]
        
        const uh = new FileUploadHandler(form)
        
        const fileInput1 = $("#photo_upload1")[0]
        
        const filename1 = "hello.png"
        
        const file1 = new File(["hello"],filename1 , { type: "image/png" });
        
        await userEvent.upload(fileInput1, file1);
        
        
        const fileInput2 = $("#photo_upload2")[0]
        
        const filename2 = "hello.png"
        
        const file2 = new File(["hello"],filename2 , { type: "image/png" });
  
        await userEvent.upload(fileInput2, file2);
        
        expect(uh.files["photos"]).toBeDefined()
        expect(uh.files["photos"].length).toEqual(2)
        
    })
    
    test("test merging file upload fields", async ()=>
    {
        document.body.innerHTML =`
        <form id="myform">
        <div class="form-group">
        <label for="photo_upload">Upload Photos</label>
        <input type="file" class="form-control-file" name="photo" id="photo_upload">
        </div>
        <div class="form-group">
        <label for="doc_upload">Upload Documents</label>
        <input type="file" class="form-control-file" name="doc" id="doc_upload">
        </div>
        </form>
        ` 
        const form = <HTMLFormElement>$("#myform")[0]
        
        const uh = new FileUploadHandler(form)
        
        const fileInput1 = $("#photo_upload")[0]
        
        const filename1 = "hello.png"
        
        const file1 = new File(["hello"],filename1 , { type: "image/png" });
        
        await userEvent.upload(fileInput1, file1);
        
        
        const fileInput2 = $("#doc_upload")[0]
        
        const filename2 = "resume.pdf"
        
        const file2 = new File(["MyResume"],filename2 , { type: "application/pdf" });
  
        await userEvent.upload(fileInput2, file2);
        
        const fdc = new FormDataCollector(form)
        const fd = fdc.getInputs()
        
        uh.merge(fd)
        expect((<FileUpload>fd["photo"]).file_name).toEqual(filename1)
        expect((<FileUpload>fd["doc"]).file_name).toEqual(filename2)
        
    })
    
    test("test merging file upload fields and other fields", async ()=>
    {
        document.body.innerHTML =`
        <form id="myform">
        
        <div >
            <label for="email_addr">Email address</label>
            <input type="email" class="form-control" 
            id="email_addr" name="email" >
        </div>
        <div class="form-group">
        <label for="photo_upload">Upload Photos</label>
        <input type="file" class="form-control-file" name="photo" id="photo_upload">
        </div>
        
        </form>
        ` 
        const form = <HTMLFormElement>$("#myform")[0]
        
        const uh = new FileUploadHandler(form)
        
        const fileInput = $("#photo_upload")[0]
        
        const filename = "hello.png"
        
        const file = new File(["hello"],filename , { type: "image/png" });
        
        await userEvent.upload(fileInput, file);
        
        const fdc = new FormDataCollector(form)
        const fd = fdc.getInputs()
        
        uh.merge(fd)
        console.log("form data merged ", fd)
        expect((<FileUpload>fd["photo"]).file_name).toEqual(filename)
        
    })
})