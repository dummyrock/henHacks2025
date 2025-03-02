import { EzComponent, BindValue } from "@gsilber/webez";
import html from "./Perscriptions.component.html";
import css from "./Perscriptions.component.css";

export class PerscriptionsComponent extends EzComponent {

     @BindValue("perscirption-item")
    private newDiagnosis: string = "Naproxen"

    constructor() {
        super(html, css);
    }
    changeString(diagnosis: string){
        this.newDiagnosis = diagnosis;
    }
}

