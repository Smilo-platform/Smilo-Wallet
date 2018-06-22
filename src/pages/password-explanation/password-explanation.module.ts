import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PasswordExplanationPage } from './password-explanation';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    PasswordExplanationPage,
  ],
  imports: [
    IonicPageModule.forChild(PasswordExplanationPage),
    TranslateModule,
    ComponentsModule
  ],
})
export class PasswordExplanationPageModule {}
