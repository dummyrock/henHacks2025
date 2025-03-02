import { EzComponent, Click, BindValue, Change, ValueEvent, BindStyle } from "@gsilber/webez";
import html from "./user_home.component.html";
import css from "./user_home.component.css";
import { DiagnosesComponent } from "../Diagnoses/Diagnoses.component";
import { PerscriptionsComponent } from "../Perscriptions/Perscriptions.component";
import { SymptomsComponent } from "../Symptoms/Symptoms.component";

export class UserHomepageComponent extends EzComponent {

    private diagnoses: DiagnosesComponent = new DiagnosesComponent();
    private perscriptions: PerscriptionsComponent = new PerscriptionsComponent();
    private symptoms: SymptomsComponent = new SymptomsComponent();
    @BindValue("diagnosis-appended")
    private newDiagnosis: string = "";
    @BindValue("perscription-appended")
    private newPerscription: string = "";
    @BindValue("symptoms-appended")
    private newSymptom: string = "";

    @BindStyle("patientInfo", "display")
    public profileDisplay: string = "block"
    @BindStyle("healthprovider-info", "display")
    public providerDisplay: string = "none"
    @BindStyle("perscription-diagnoses", "display")
    public healthDisplay: string = "none"
    @BindStyle("notifications", "display")
    public notifcationDisplay: string = "none"



    constructor() {
        super(html, css);
    }

    @Change("diagnosis-appended")
    onDiagnosisChange(event: ValueEvent) {
        this.newDiagnosis = event.value;
    }

    @Click("add-diagnoses")
    addDiagnosis(){
        this.diagnoses = new DiagnosesComponent();
        this.diagnoses.changeString(this.newDiagnosis)
        this.addComponent(this.diagnoses, "diagonis-list")
    }

    @Change("perscription-appended")
    onPerscriptionChange(event: ValueEvent){
        this.newPerscription = event.value
    }

    @Click("add-perscription")
    addPerscription(){
        this.perscriptions = new PerscriptionsComponent();
        this.perscriptions.changeString(this.newPerscription)
        this.addComponent(this.perscriptions, "perscription-list")
    }

    @Change("symptoms-appended")
    onSymptomChange(event: ValueEvent){
        this.newSymptom = event.value
    }

    @Click("add-symptoms")
    addSymptom(){
        this.symptoms = new SymptomsComponent();
        this.symptoms.changeString(this.newSymptom)
        this.addComponent(this.symptoms, "symptoms-list")
    }

    @Click("patient-tab")
    showPatient(){
        this.profileDisplay = "block"
        this.providerDisplay = "none"
        this.healthDisplay = "none"
        this.notifcationDisplay = "none"
    }

    @Click("provider-tab")
    showProvider(){
        this.profileDisplay = "none"
        this.providerDisplay = "block"
        this.healthDisplay = "none"
        this.notifcationDisplay = "none"
    }

    @Click("health-tab")
    showHealth(){
        this.profileDisplay = "none"
        this.providerDisplay = "none"
        this.healthDisplay = "block"
        this.notifcationDisplay = "none"
    }
    @Click("notifications-tab")
    showNotification(){
        this.profileDisplay = "none"
        this.providerDisplay = "none"
        this.healthDisplay = "none"
        this.notifcationDisplay = "block"
    }
    
}
