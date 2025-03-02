import { BindValue, EzComponent } from "@gsilber/webez";
import html from "./notification.component.html";
import css from "./notification.component.css";

export class NotificationComponent extends EzComponent {
    @BindValue('date')
    private date: string = "";

    @BindValue('notif_type')
    private type: string= "";

    @BindValue('description')
    private description: string = "";

    @BindValue('doctor-name')
    private doctorName:string ="";

    constructor(date: string, type: string, description: string,doctorName:string) {
        super(html, css);
        this.date = date;
        this.type = type;
        this.description = description;
        this.doctorName = doctorName;
    }
    
}
