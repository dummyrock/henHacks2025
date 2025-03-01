import { describe, expect, test, beforeAll } from "@jest/globals";
import { NavigationComponent } from "./navigation.component";
import { bootstrap } from "@gsilber/webez";

describe("NavigationComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<NavigationComponent>(NavigationComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(NavigationComponent);
        });
    });
});
