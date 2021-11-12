import $ from "@sisukas/jquery";
import {FormDataValues} from "../api/SubmissionRecord";
import {FormElement} from "./FormElement"

/*

Select ->
 Allowed values ?
 
Type validations
  tel
  email
  url
  number
  
html5 Validations
required
maxlegth
minlength
pattern attribute
min -> for type=number or range or for date picker 
max

## Server side options
select field - limit values to the options

datetime/date field - validations

textfield -> allow input from a list only -> example: coupon code, simple captcha, 
allowed zip codes 

*/

//Use jest to test loading HTML and manipulating the dom
//https://dev.to/snowleo208/things-i-learned-after-writing-tests-for-js-and-html-page-4lja


export class FormDataCollector{
    constructor(private form:HTMLFormElement){
    }
    
    public getInputs():FormDataValues
    {
        let ret:FormDataValues={}
        $("input,select,textarea",this.form).each((_i:number,e:HTMLElement)=>{
            const elmnt = new FormElement(e)
            const name = elmnt.getName()
            if(name in ret || name.length <=0)
            {//captured already
                return
            }
            
            ret[name] = elmnt.getValue()
        });
        
        return(ret)
    }
}