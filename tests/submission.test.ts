import $ from "@sisukas/jquery"
import { FormSubmissionHandler } from '../src/submission/FormSubmissionHandler';
import {ThankYouMessage, SubmissionResponse, SubmissionRecord} from "../src/api";
import {PopupOptions} from "../src/display/IDisplay"

describe("form-submission-handler",()=>{
    test("collects data",async ()=>
    {
        document.body.innerHTML =`
        <form id="myform">
        <input type="text" name="name" />
        </form>
        `;
        const thankyou:ThankYouMessage = {
            type:"message",
            message:"received form submission",
            display_style:"",
            submission_id:"uytuytuyt"
        }
        
        const dockapi ={
            //@ts-ignore
            postForm: jest.fn((_sr:SubmissionRecord)=>Promise.resolve(thankyou) ),
            uploadFile: jest.fn((_file:File)=>Promise.resolve("upload_id") )
        }
        const form = <HTMLFormElement>$("#myform")[0]
        const settings = {
            token:"token123",
            fields:[
                {
                    name:"name",
                    type:"text",
                    validations:{}
                }
            ],
            payment_processor:"",
            payment_api_key:""
        }

        const progress ={
            showProgress:jest.fn(function(){}),
            popup:{
                show(_opt:PopupOptions){},
                hide(){},
                showProgress(){}
            },
            displayThankYou(_resp:SubmissionResponse){}
        }

        const sh = new FormSubmissionHandler(form,settings, dockapi)
        await sh.submit(progress)
        
        expect(dockapi.postForm).toHaveBeenCalled()
    })

})