import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransferPage } from './transfer';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    TransferPage,
  ],
  imports: [
    IonicPageModule.forChild(TransferPage),
    TranslateModule,
    ComponentsModule
  ],
})
export class TransferPageModule {}
