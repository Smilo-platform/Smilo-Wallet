import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { SmiloWallet } from './app.component';
import { HomePageModule } from '../pages/home/home.module';

@NgModule({
  declarations: [
    SmiloWallet
  ],
  imports: [
    BrowserModule,
    HomePageModule,
    IonicModule.forRoot(SmiloWallet)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    SmiloWallet
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
