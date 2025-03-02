import { describe, expect, test, beforeAll } from "@jest/globals";
import { SymptomsComponent } from "./Symptoms.component";
import { bootstrap } from "@gsilber/webez";

describe("SymptomsComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<SymptomsComponent>(SymptomsComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(SymptomsComponent);
        });
    });
});
