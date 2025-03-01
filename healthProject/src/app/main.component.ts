import html from "./main.component.html";
import css from "./main.component.css";
import { EzComponent, Click, EventSubject, BindCSSClass, BindStyle } from '@gsilber/webez';

/**
 * @description MainComponent is the main component of the app
 * @extends EzComponent
 * 
 */
export class MainComponent extends EzComponent {
    
    @BindStyle("returning-user", "display")
    public returningDisplay: string = "none";
    @BindStyle("new-user", "display")
    public newDisplay: string = "none"

    constructor() {
        super(html, css);
    }

    @Click("login")
    showLogin(){
        this.newDisplay = "none"
        this.returningDisplay = "block"
    }
    @Click("signUp")
    showSignup(){
        this.returningDisplay = "none"
        this.newDisplay = "block"
    }
}

