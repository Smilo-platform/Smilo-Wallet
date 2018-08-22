import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsGeneralPage } from '../../pages/settings-general/settings-general';

/**
 * Generated class for the NavHeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
	selector: 'smilo-nav-header',
	templateUrl: 'nav-header.html'
})
export class NavHeaderComponent {
	@Input() titleTranslationKey: string;

	constructor(public navCtrl: NavController) {

	}

	/**
	* Open the settings page
	*/
	openSettingsPage(): void {
		this.navCtrl.push(SettingsGeneralPage);
	}

}
