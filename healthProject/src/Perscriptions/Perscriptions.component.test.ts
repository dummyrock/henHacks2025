import { describe, expect, test, beforeAll } from "@jest/globals";
import { PerscriptionsComponent } from "./Perscriptions.component";
import { bootstrap } from "@gsilber/webez";

describe("PerscriptionsComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<PerscriptionsComponent>(PerscriptionsComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(PerscriptionsComponent);
        });
    });
});
