import { Component, Input } from "@angular/core";

@Component({
  selector: "smilo-logo",
  templateUrl: "logo.html"
})
export class LogoComponent {
  @Input()
  subTitleTranslationKey: string;

}
