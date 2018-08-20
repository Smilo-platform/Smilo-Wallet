import { NgModule } from '@angular/core';
import { NavHeaderComponent } from './nav-header/nav-header';
import { PasswordStrengthComponent } from './password-strength-field/password-strength';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { LogoComponent } from './logo/logo';
import { ExpandableComponent } from './expandable/expandable';

@NgModule({
	declarations: [
		NavHeaderComponent,
		PasswordStrengthComponent,
		LogoComponent,
		ExpandableComponent
	],
	imports: [
		IonicPageModule.forChild(NavHeaderComponent),
		TranslateModule
	],
	exports: [
		NavHeaderComponent,
		PasswordStrengthComponent,
		LogoComponent,
		ExpandableComponent
	]
})
export class ComponentsModule {}
