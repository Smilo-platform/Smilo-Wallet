import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestPage } from './request';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    RequestPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestPage),
    TranslateModule,
    ComponentsModule
  ],
})
export class RequestPageModule {}
