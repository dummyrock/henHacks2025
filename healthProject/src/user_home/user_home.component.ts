import { EzComponent, Click, BindValue, Change, ValueEvent, BindStyle, BindValueToNumber } from "@gsilber/webez";
import html from "./user_home.component.html";
import css from "./user_home.component.css";
import { DiagnosesComponent } from "../Diagnoses/Diagnoses.component";
import { PerscriptionsComponent } from "../Perscriptions/Perscriptions.component";
import { SymptomsComponent } from "../Symptoms/Symptoms.component";
import axios from "axios";

interface User {
    username: string
    password: string
    email: string
    phone_number: string
    carrier: string
    height: number
    weight: number
  }

async function getUser(userId: number) {
    const response = await axios.get(`http://128.4.102.9:8000/users/${userId}`,{
        headers: {
            "X-API-KEY": "secret-key-123"
          }
    });
    return response.data;
}

async function getHealthEntries(userId: number) {
    const response = await axios.get(`http://128.4.102.9:8000/users/${userId}/health-entries/`,{
        headers: {
            "X-API-KEY": "secret-key-123"
          }
    });
    return response.data;
}

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

    @BindValue("patient-username")
    private patientName: string = "";
    @BindValueToNumber("patient-height")
    private height: number = 0;
    @BindValueToNumber("patient-weight")
    private weight: number = 0;
    @BindValue("patient-number")
    private patientNumber: string = "";

    private userID = 0;
    private userInfo!: User;

    constructor() {
        super(html, css);
    }

    async setUserData() {
        try {
            this.userInfo = await getUser(this.userID);
            this.initData();
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    async setHealthData() {
        try {
            console.log(await getHealthEntries(this.userID));
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    @Change("diagnosis-appended")
    onDiagnosisChange(event: ValueEvent) {
        this.newDiagnosis = event.value;
    }

    private initData(){
        this.patientName = this.userInfo.username
        this.height = this.userInfo.height;
        this.weight = this.userInfo.weight;
        this.patientNumber = this.userInfo.phone_number;
    }

    public setUserID(userID:number){
        this.userID = userID;
        this.setUserData();
        this.setHealthData();
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
