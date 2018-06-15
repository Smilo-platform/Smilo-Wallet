import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
import { SettingsProvider } from './../../providers/settings/settings';

/**
 * Generated class for the SettingsGeneralPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-settings-general",
  templateUrl: "settings-general.html",
})
export class SettingsGeneralPage {
  private nightModeStatus: boolean = false;
  private twoFactorAuthStatus: boolean = false;
  selectedTheme: String;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public translate: TranslateService, 
              public settings: SettingsProvider) {
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SettingsGeneralPage");
  }

  nightModeSwitch() {
    console.log("SettingsPage: nightmodeSwitch enabled " + this.nightModeStatus);
    if (this.selectedTheme === 'dark-theme') {
      this.settings.setActiveTheme('light-theme');
    } else {
      this.settings.setActiveTheme('dark-theme');
    }
  }

  twoFactorAuthSwitch() {
    console.log("SettingsPage: twoFactorAuthSwitch enabled " + this.twoFactorAuthStatus);
  }

  changeLanguage(language) {
    console.log("SettingsPage: changeLanguage: " + language);
    this.translate.use(language);
  }

}