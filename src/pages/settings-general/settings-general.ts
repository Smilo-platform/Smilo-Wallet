import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
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
  private activeLanguage: string;
  private selectedTheme: ThemeType;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public translate: TranslateService,
              public settingsService: SettingsService) {
    this.settingsService.getActiveTheme().subscribe(val => this.selectedTheme = <ThemeType>val);
    if (this.selectedTheme === "dark-theme") {
      this.nightModeStatus = true;
    }
    this.settingsService.getLanguageSettings().then(data => {
      this.activeLanguage = data;
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SettingsGeneralPage");
  }

  nightModeSwitch(): void {
    console.log("SettingsPage: nightmodeSwitch enabled " + this.nightModeStatus);
    if (this.selectedTheme === 'dark-theme') {
      this.settingsService.setActiveTheme('light-theme');
    } else {
      this.settingsService.setActiveTheme('dark-theme');
    }
    this.settingsService.saveNightModeSettings(this.selectedTheme);
  }

  changeLanguage(language): void {
    console.log("SettingsPage: changeLanguage: " + language);
    this.translate.use(language);
    this.settingsService.saveLanguageSettings(language);
  }

}