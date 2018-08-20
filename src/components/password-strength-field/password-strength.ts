import { Component, Input, SimpleChanges } from '@angular/core';
import { PasswordService } from '../../services/password-service/password-service';
import { BulkTranslateService } from '../../services/bulk-translate-service/bulk-translate-service';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the PasswordStrengthComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'smilo-password-strength-field',
  templateUrl: 'password-strength.html'
})
export class PasswordStrengthComponent {
  // The password input to check
  @Input() password: string;
  // List of translations set programmatically
  translations: Map<string, string> = new Map<string, string>();
  // The password strength object
  passwordStrength: any;
  // The password strength between and including 0-4. Default 0
  passwordStrengthScore: number = 0;
  // The default password strength score text
  passwordStrengthScoreText: string;
  // The array of feedback messages
  passwordFeedbackWarning: string[] = [];
  // The online throttling time
  onlineThrottlingMessage: string = "-";
  // The online no throttling time
  onlineNoThrottlingMessage: string = "-";
  // The offline slow hashing time
  offlineSlowHashingMessage: string = "-";
  // The offline fast hashign time
  offlineFastHashingMessage: string = "-";
  // The toggle for the advanced content to show
  showPasswordAdvanced: boolean = false;

  /**
   * @param passwordService The password service to get the strength from
   */
  constructor(private passwordService: PasswordService,
              private bulkTranslateService: BulkTranslateService,
              private translateService: TranslateService) { 
    this.getAndSubscribeToTranslations();
  }

  /**
   * Retrieves the translation and again if the language changed
   */
  getAndSubscribeToTranslations(): void {
    this.translateService.onLangChange.subscribe(data => {
      this.retrieveTranslations();
    });
    this.retrieveTranslations();
  }

  /**
     * Gets the translations to set programmatically
     */
    retrieveTranslations(): Promise<Map<string, string>> {
      return this.bulkTranslateService.getTranslations([
          "password-strength-component.fill-strong-password",
          "password-strength-component.password-weak",
          "password-strength-component.password-normal",
          "password-strength-component.password-good",
          "password-strength-component.password-excellent",
      ]).then(data => {
          this.translations = data;
          this.passwordStrengthScoreText = this.translations.get("password-strength-component.fill-strong-password");
          return data;
      });
  }

  /**
   * Toggles the boolean for the advanced content view
   */
  togglePasswordAdvanced() {
    this.showPasswordAdvanced = !this.showPasswordAdvanced;
  }
  
  /**
   * Whenever there is a change
   * @param changes Object with changes
   */
  ngOnChanges(changes: SimpleChanges) {
    this.checkPassword();
  }

  /**
   * Check the password
   */
  checkPassword() {
    // When there is a password to check
    if (this.password !== undefined && this.password !== null && this.password.length > 0) {
      this.passwordStrength = this.passwordService.passwordStrength(this.password);
      this.passwordStrengthScore = this.passwordStrength.score;
      // Switch between the different scores to show an appropriate message. 
      switch(this.passwordStrengthScore) {
        case 0: 
          this.passwordStrengthScoreText = this.translations.get("password-strength-component.fill-strong-password");
          break;
        case 1:
          this.passwordStrengthScoreText = this.translations.get("password-strength-component.password-weak");
          break;
        case 2:
          this.passwordStrengthScoreText = this.translations.get("password-strength-component.password-normal");
          break;
        case 3:
          this.passwordStrengthScoreText = this.translations.get("password-strength-component.password-good");
          break;
        case 4:
          this.passwordStrengthScoreText = this.translations.get("password-strength-component.password-excellent");
          break;
        default:
          break;
      }
      // Reset the feedback list
      this.passwordFeedbackWarning = [];
      // Set the times for the different scenario's
      this.onlineThrottlingMessage = this.passwordStrength.crack_times_display.online_throttling_100_per_hour;
      this.onlineNoThrottlingMessage = this.passwordStrength.crack_times_display.online_no_throttling_10_per_second;
      this.offlineSlowHashingMessage = this.passwordStrength.crack_times_display.offline_slow_hashing_1e4_per_second;
      this.offlineFastHashingMessage = this.passwordStrength.crack_times_display.offline_fast_hashing_1e10_per_second;
      let index = 0;
      // For every suggestion
      for (let suggestion of this.passwordStrength.feedback.suggestions) {
        index++;
        // Add the message
        this.passwordFeedbackWarning.push(index + ". " + suggestion);
      }
    } else {
      // Reset the fields
      this.passwordFeedbackWarning = [];
      this.onlineThrottlingMessage = "-";
      this.onlineNoThrottlingMessage = "-";
      this.offlineSlowHashingMessage = "-";
      this.offlineFastHashingMessage = "-";
    }
  }
}
