import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule, NavController, NavParams } from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { MockTranslationLoader } from "../../../test-config/mocks/MockTranslationLoader";
import { ComponentsModule } from "../../components/components.module";
import { NavHeaderComponent } from "./nav-header";
import { SettingsGeneralPage } from "../../pages/settings-general/settings-general";

describe("NavHeader", () => {
	let comp: NavHeaderComponent;
	let fixture: ComponentFixture<NavHeaderComponent>;
	let navController: MockNavController;

	beforeEach(async(() => {
		navController = new MockNavController();

		TestBed.configureTestingModule({
			declarations: [NavHeaderComponent],
			imports: [
				IonicModule.forRoot(NavHeaderComponent),
				TranslateModule.forRoot({
					loader: { provide: TranslateLoader, useClass: MockTranslationLoader },
				})
			],
			providers: [
				{ provide: NavController, useValue: navController }
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NavHeaderComponent);
		comp = fixture.componentInstance;
	});

	it("should create component", () => expect(comp).toBeDefined());

	it("should push the settingspage on the navcontroller", () => {
		spyOn(navController, "push");

		comp.openSettingsPage();

		expect(navController.push).toHaveBeenCalledWith(SettingsGeneralPage);
	});

});