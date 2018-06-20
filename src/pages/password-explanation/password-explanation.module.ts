import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PasswordExplanationPage } from './password-explanation';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PasswordExplanationPage,
  ],
  imports: [
    IonicPageModule.forChild(PasswordExplanationPage),
    TranslateModule
  ],
})
export class PasswordExplanationPageModule {}
