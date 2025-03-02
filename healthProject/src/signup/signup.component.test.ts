import { describe, expect, test, beforeAll } from "@jest/globals";
import { SignupComponent } from "./signup.component";
import { bootstrap } from "@gsilber/webez";

describe("SignupComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<SignupComponent>(SignupComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(SignupComponent);
        });
    });
});
