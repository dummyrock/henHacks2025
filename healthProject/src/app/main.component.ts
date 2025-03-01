import html from "./main.component.html";
import css from "./main.component.css";
import { EzComponent } from '@gsilber/webez';

/**
 * @description MainComponent is the main component of the app
 * @extends EzComponent
 * 
 */
export class MainComponent extends EzComponent {

    constructor() {
        super(html, css);
    }
}
