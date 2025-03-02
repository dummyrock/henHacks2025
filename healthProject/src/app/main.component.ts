import html from "./main.component.html";
import css from "./main.component.css";
import { EzComponent, Click, EventSubject, BindCSSClass, BindStyle } from '@gsilber/webez';
import { UserHomepageComponent } from "../user_home/user_home.component";

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
    private userHomepage: UserHomepageComponent = new UserHomepageComponent();

    constructor() {
        super(html, css);
        this.addComponent(this.userHomepage, "user-homepage");
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

