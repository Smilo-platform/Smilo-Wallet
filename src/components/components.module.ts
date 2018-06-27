import { NgModule } from '@angular/core';
import { NavHeaderComponent } from './nav-header/nav-header';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { LogoComponent } from './logo/logo';

@NgModule({
	declarations: [
		NavHeaderComponent,
    	LogoComponent
	],
	imports: [
		IonicPageModule.forChild(NavHeaderComponent),
		TranslateModule
	],
	exports: [
		NavHeaderComponent,
		LogoComponent
	]
})
export class ComponentsModule {}
