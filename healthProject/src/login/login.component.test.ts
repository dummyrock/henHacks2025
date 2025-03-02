import { describe, expect, test, beforeAll } from "@jest/globals";
import { LoginComponent } from "./login.component";
import { bootstrap } from "@gsilber/webez";

describe("LoginComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<LoginComponent>(LoginComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(LoginComponent);
        });
    });
});
