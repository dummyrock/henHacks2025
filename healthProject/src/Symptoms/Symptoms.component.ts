import { EzComponent, BindValue } from "@gsilber/webez";
import html from "./Symptoms.component.html";
import css from "./Symptoms.component.css";

export class SymptomsComponent extends EzComponent {

     @BindValue("symptom-item")
    private newSymptom: string = "Fever"

    constructor() {
        super(html, css);
    }
    changeString(symptom: string){
        this.newSymptom = symptom;
    }
}
