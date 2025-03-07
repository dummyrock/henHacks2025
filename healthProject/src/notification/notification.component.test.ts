import { describe, expect, test, beforeAll } from "@jest/globals";
import { NotificationComponent } from "./notification.component";
import { bootstrap } from "@gsilber/webez";

describe("NotificationComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<NotificationComponent>(NotificationComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(NotificationComponent);
        });
    });
});
