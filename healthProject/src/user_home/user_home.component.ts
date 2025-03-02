import { EzComponent } from "@gsilber/webez";
import html from "./user_home.component.html";
import css from "./user_home.component.css";

export class UserHomepageComponent extends EzComponent {
    constructor() {
        super(html, css);
    }
}
