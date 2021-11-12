import {SubmissionResponse} from "../api"

export type PopupOptions={
    title ?: string,
    content : string        
}

export interface IPopup
{
    show(opt:PopupOptions):void
    hide():void
    showProgress():void
}

export interface IDisplay
{
    popup:IPopup
    displayThankYou(resp:SubmissionResponse):void
}