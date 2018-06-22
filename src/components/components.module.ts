import { NgModule } from '@angular/core';
import { NavHeaderComponent } from './nav-header/nav-header';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
	declarations: [
		NavHeaderComponent
	],
	imports: [
		IonicPageModule.forChild(NavHeaderComponent),
		TranslateModule
	],
	exports: [NavHeaderComponent]
})
export class ComponentsModule {}
