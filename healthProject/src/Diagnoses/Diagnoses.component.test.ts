import { describe, expect, test, beforeAll } from "@jest/globals";
import { DiagnosesComponent } from "./Diagnoses.component";
import { bootstrap } from "@gsilber/webez";

describe("DiagnosesComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<DiagnosesComponent>(DiagnosesComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(DiagnosesComponent);
        });
    });
});
