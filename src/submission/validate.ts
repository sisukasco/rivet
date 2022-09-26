import {Field} from "../api/settings"
import {FormDataValues} from "../api/SubmissionRecord"
import {makeBoel} from "@sisukas/boel";
import $ from "@sisukas/jquery";
import {commonAncestor} from "./parent"
export interface ErrorMap {
    [field: string]: {
        message: string;
    };
}

export class OpResult {
    hasErrors:boolean=false
    errors:ErrorMap={}
}



export function validateForm(form:HTMLFormElement, 
    fields:Field[], fdd:FormDataValues)
{
    let b = makeBoel();
    let res = b.validateFields(fields, fdd);
    $(".ratufa-error", $(form)).remove();
    if(res.has_errors && res.error_map)
    {
        return showErrorsNextToElements(form, res.error_map)
    }
    return true;
}

export function showErrorsNextToElements(form:HTMLFormElement, errors_map: ErrorMap){
    let other_errors:string[]=[]
    $(".ratufa-error", $(form)).remove();
    for(let f in errors_map)
    {
        let e = errors_map[f].message; 
        let elm = getElement(f, form);
        if(!elm)
        {
            other_errors.push(e)
            continue;
        }
        if(elm.length > 1)
        {
            let elms = elm.get()
            let parent = commonAncestor(elms[0],elms[elms.length - 1 ])
            if(parent)
            {
                $(parent).append(`<div class="ratufa-error">${e}</div>`);
            }else{
                console.error("common parent was not found")
            }
            
        }
        else
        {
            $(elm).after(`<div class="ratufa-error">${e}</div>`);    
        }
        
    }

    return other_errors;
}
//TODO: use ID of element also (instead of name)
function getElement(name:string, form:HTMLFormElement)
{
    let $e = $(`[name="${name}"]`, form);
    if($e.length <= 0)
    {
        $e = $('#'+name, form);
        if($e.length <= 0)
        {
            return null;
        }
    }
    return $e;
    
}
