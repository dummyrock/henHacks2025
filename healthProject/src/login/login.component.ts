import { EzComponent, Click, BindValue, EventSubject } from "@gsilber/webez";
import html from "./login.component.html";
import css from "./login.component.css";

interface UserLogin {
    username: string;
    password: string;
}

export class LoginComponent extends EzComponent {

    clickEvent: EventSubject<void> = new EventSubject<void>();
    private userData!: UserLogin;
    constructor() {
        super(html, css);
    }

    public sendUserID(){
        return this.userData;
    }

    @Click("submit")
    onClick(event: Event){
        const username = this.getValue("InUserID");
        const password = this.getValue("InKeyID");
        this.userData = {
            username: username,
            password: password
        }
        this.clickEvent.next();
    }
}
