import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RestoreBackupPage } from "./restore-backup";
import { IonicModule, NavController, NavParams} from "ionic-angular/index";
import { MockNavController } from "../../../test-config/mocks/MockNavController";
import { MockNavParams } from "../../../test-config/mocks/MockNavParams";

describe("RestoreBackupPage", () => {
  let comp: RestoreBackupPage;
  let fixture: ComponentFixture<RestoreBackupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RestoreBackupPage],
      imports: [
        IonicModule.forRoot(RestoreBackupPage)
      ],
      providers: [
        { provide: NavController, useClass: MockNavController },
        { provide: NavParams, useValue: new MockNavParams() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoreBackupPage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined())
});