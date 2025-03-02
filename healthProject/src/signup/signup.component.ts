import { Click, EventSubject, EzComponent } from "@gsilber/webez";
import html from "./signup.component.html";
import css from "./signup.component.css";

export class SignupComponent extends EzComponent {
    clickEvent: EventSubject<void> = new EventSubject<void>();
    constructor() {
        super(html, css);
    }

    @Click("submit")
    onClick(event: Event){
        this.clickEvent.next();
    }
}
