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

        $('.dockform-popup-close', $('#dockform_popup')).on("click",()=>{
            this.hide()
        })
    }
    public showPopup(content:string, title:string="DockForm")
    {
        this.show({title, content})
    }
    public show(options:PopupOptions)
    {
        let $dp = $('#dockform_popup');
    
        if(!options.title)
        {
            $('.dockform-popup-title', $dp).hide();    
        }
        else
        {
            $('.dockform-popup-title', $dp).html(options.title).show();
        }
        $('.dockform-popup-close', $dp).show();
        
        $('.dockform-popup-content', $dp).html(options.content)
        $('#dockform_popup').css({"visibility":"visible","opacity":100})
    }
    public showAnimation()
    {
        let $dp = $('#dockform_popup');
        $('.dockform-popup-title', $dp).hide();
        $('.dockform-popup-close', $dp).hide();
        $('.dockform-popup-content', $dp).html(progress);
        
        $('#dockform_popup').css({"visibility":"visible","opacity":100});
    }
    public showProgress()
    {
        this.showAnimation()   
    }
    public hide()
    {
        $('#dockform_popup').css({"visibility":"hidden","opacity":0})
    }
}