import { describe, expect, test, beforeAll } from "@jest/globals";
import { UserHomepageComponent } from "./user_home.component";
import { bootstrap } from "@gsilber/webez";

describe("User_homeComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<UserHomepageComponent>(UserHomepageComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(UserHomepageComponent);
        });
    });
});
