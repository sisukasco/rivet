import $ from "@sisukas/jquery";
import "./styles.css";
import pop from "./popup.html";
import progress from "./progress.html";
import {PopupOptions} from "./IDisplay";

export default class Popup
{
    public init()
    {
        $('body').append(pop);

        $('.ratufa-popup-close', $('#ratufa_popup')).on("click",()=>{
            this.hide()
        })
    }
    public showPopup(content:string, title:string="Ratufa")
    {
        this.show({title, content})
    }
    public show(options:PopupOptions)
    {
        let $dp = $('#ratufa_popup');
    
        if(!options.title)
        {
            $('.ratufa-popup-title', $dp).hide();    
        }
        else
        {
            $('.ratufa-popup-title', $dp).html(options.title).show();
        }
        $('.ratufa-popup-close', $dp).show();
        
        $('.ratufa-popup-content', $dp).html(options.content)
        $('#ratufa_popup').css({"visibility":"visible","opacity":100})
    }
    public showAnimation()
    {
        let $dp = $('#ratufa_popup');
        $('.ratufa-popup-title', $dp).hide();
        $('.ratufa-popup-close', $dp).hide();
        $('.ratufa-popup-content', $dp).html(progress);
        
        $('#ratufa_popup').css({"visibility":"visible","opacity":100});
    }
    public showProgress()
    {
        this.showAnimation()   
    }
    public hide()
    {
        $('#ratufa_popup').css({"visibility":"hidden","opacity":0})
    }
}