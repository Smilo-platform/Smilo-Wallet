import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-faq",
  templateUrl: "faq.html",
})
export class FaqPage {

  constructor(private navCtrl: NavController, 
              private navParams: NavParams) {
  }
}
