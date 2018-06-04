import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HomePage } from "./home";
import { IonicModule, Platform, NavController} from "ionic-angular/index";

describe("HomePage", () => {
  let comp: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [
        IonicModule.forRoot(HomePage)
      ],
      providers: [
        
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    comp = fixture.componentInstance;
  });

  it("should create component", () => expect(comp).toBeDefined());
});