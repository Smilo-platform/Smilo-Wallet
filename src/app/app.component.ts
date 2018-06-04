import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { HomePage } from "../pages/home/home";
import { TranslateService } from "@ngx-translate/core";
@Component({
  templateUrl: "app.html"
})
export class SmiloWallet {
  rootPage: any = HomePage;

  constructor(private platform: Platform, 
              private statusBar: StatusBar, 
              private splashScreen: SplashScreen,
              private translate: TranslateService) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      translate.setDefaultLang("en");
      translate.use("en");
    });
  }
}
