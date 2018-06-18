import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
import { SettingsProvider } from './../../providers/settings/settings';
import { SettingsService, ThemeType } from "../../services/settings-service/settings-service";

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
  selectedTheme: ThemeType;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public translate: TranslateService, 
              public settings: SettingsProvider,
              public settingsService: SettingsService) {
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = <ThemeType>val);
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
    this.settingsService.saveNightModeSettings(this.selectedTheme);
  }

  twoFactorAuthSwitch() {
    console.log("SettingsPage: twoFactorAuthSwitch enabled " + this.twoFactorAuthStatus);
  }

  changeLanguage(language) {
    console.log("SettingsPage: changeLanguage: " + language);
    this.translate.use(language);
    this.settingsService.saveLanguageSettings(language);
  }

}