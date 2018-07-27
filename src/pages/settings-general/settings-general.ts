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
  nightModeStatus: boolean = false;
  showFundsStatus: boolean;
  activeLanguage: string;
  selectedTheme: ThemeType;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public translate: TranslateService,
              public settingsService: SettingsService) {}

  ionViewDidLoad(): Promise<void> {
    this.settingsService.getActiveTheme().subscribe(val => this.selectedTheme = val);
    if (this.selectedTheme === "dark-theme") {
      this.nightModeStatus = true;
    } else {
      this.nightModeStatus = false;
    }
    this.settingsService.getFundsSwitchStatus().subscribe(val => {
      this.showFundsStatus = val
    });
    return this.settingsService.getLanguageSettings().then(data => {
      if (data === null || data === undefined) {
        this.activeLanguage = "en";
      } else {
        this.activeLanguage = data;
      }
    });
  }

  nightModeSwitch(): void {
    if (this.selectedTheme === 'dark-theme') {
      this.settingsService.setActiveTheme('light-theme');
    } else {
      this.settingsService.setActiveTheme('dark-theme');
    }
    this.settingsService.saveNightModeSettings(this.selectedTheme);
  }

  /**
   * Called when pressing the funds switch
   */
  fundsSwitch(): void {
    if (this.showFundsStatus) {
      this.settingsService.setFundsSwitchStatus(true);
      this.settingsService.saveFundsSwitchSettings(true);
    } else {
      this.settingsService.setFundsSwitchStatus(false);
      this.settingsService.saveFundsSwitchSettings(false);
    }
  }

  changeLanguage(language): void {
    this.translate.use(language);
    this.settingsService.saveLanguageSettings(language);
  }

}