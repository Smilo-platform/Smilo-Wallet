import { NgModule } from '@angular/core';
import { NavHeaderComponent } from './nav-header/nav-header';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { LogoComponent } from './logo/logo';
import { ExpandableComponent } from './expandable/expandable';

@NgModule({
	declarations: [
		NavHeaderComponent,
		LogoComponent,
		ExpandableComponent
	],
	imports: [
		IonicPageModule.forChild(NavHeaderComponent),
		TranslateModule
	],
	exports: [
		NavHeaderComponent,
		LogoComponent,
		ExpandableComponent
	]
})
export class ComponentsModule {}
