import { EzComponent, BindValue, Click } from "@gsilber/webez";
import html from "./Diagnoses.component.html";
import css from "./Diagnoses.component.css";

export class DiagnosesComponent extends EzComponent {

    @BindValue("diagnosis-item")
    private newDiagnosis: string = "COVID-19"

    constructor() {
        super(html, css);
    }

    changeString(diagnosis: string){
        this.newDiagnosis = diagnosis;
    }
}