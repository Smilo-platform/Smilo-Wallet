import { NavigationHelperService } from "./navigation-helper-service";
import { NavController } from "ionic-angular";

describe("NavigationHelperService", () => {
    let service: NavigationHelperService;

    beforeEach(() => {
        service = new NavigationHelperService();
    });

    it("should work", (done) => {
        let navControllerDummy: NavController = <any>{
            pop: () => {}
        };

        spyOn(navControllerDummy, "pop").and.callFake(() => Promise.resolve());

        service.navigateBack(navControllerDummy, 5).then(
            () => {
                expect(navControllerDummy.pop).toHaveBeenCalledTimes(5);

                done();
            }
        );
    });
});