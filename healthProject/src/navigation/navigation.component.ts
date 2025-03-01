import { EzComponent } from "@gsilber/webez";
import html from "./navigation.component.html";
import css from "./navigation.component.css";

export class NavigationComponent extends EzComponent {
    constructor() {
        super(html, css);
    }
}
