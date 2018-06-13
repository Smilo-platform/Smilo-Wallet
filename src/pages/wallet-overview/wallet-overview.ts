import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, LoadingController, Loading, Alert } from "ionic-angular";
import { Chart } from 'chart.js';
import { WalletService } from '../../services/wallet-service/wallet-service';
import { AlertController } from 'ionic-angular';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { LandingPage } from "../landing/landing";
import { ToastController } from 'ionic-angular';
import { SettingsGeneralPage } from "../settings-general/settings-general";
import { IWallet } from "../../models/IWallet";

/**
 * Generated class for the WalletOverviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export declare type VisibilityType = "shown" | "hidden"; 

@IonicPage()
@Component({
  selector: "page-wallet-overview",
  templateUrl: "wallet-overview.html",
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 , display: "none"})),
      transition('* => *', animate('500ms'))
    ])
  ]
})
export class WalletOverviewPage {
  @ViewChild('doughnutCanvas') doughnutCanvas;
  pickedCurrency: string;
  doughnutChart: Chart;
  wallets: IWallet[] = [];
  currenciesForDoughnutCanvas: number[] = [];
  currenciesForDoughnutCanvasCurrencies: string[] = [];
  currentWallet: IWallet;
  currentWalletIndex: number = 0;
  legendList: string[] = [];
  availableCurrencies: string[] = [];
  showFundsStatus: boolean = true;
  twoFactorStatus: boolean = false;
  walletFundsVisibility: VisibilityType = 'shown';
  loading: Loading;
  loadingError: Alert;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public walletService: WalletService,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController) {

  }

  initialize(): Promise<void> {
    return Promise.all([this.getAllWallets(), this.getAvailableCurrencies()]).then<void>();
  }

  ionViewDidLoad(): void {
    this.initialize();
  }

  fundsSwitch(): void {
    if (this.walletFundsVisibility === "shown") {
      this.walletFundsVisibility = "hidden";
    } else if (this.walletFundsVisibility === "hidden") {
      this.walletFundsVisibility = "shown";
    }
  }

  twoFactorStatusSwitch(): void {
    
  }

  backupWalletClick(): void {

  }

  deleteWalletClick(): void {
    const confirm = this.alertCtrl.create({
      title: 'Delete wallet',
      message: "Are you <b>sure</b> you want to delete this wallet ('" + this.currentWallet.publicKey + "')?",
      buttons: [
        {
          text: 'No, cancel',
          handler: () => {
            
          }
        },
        {
          text: 'Yes, delete',
          cssClass: 'deleteButtonCss',
          handler: () => {
            this.deleteSelectedWallet(this.currentWallet);
          }
        }
      ]
    });
    confirm.present();
  }

  deleteSelectedWallet(wallet: IWallet): boolean {
    let index = this.wallets.indexOf(wallet);
    if (index !== -1) {
      this.wallets.splice(index, 1);
      this.setCurrentWallet(0);
      return true;
    } else {
      return false;
    }
  }

  getAllWallets(): Promise<void> {
    return this.walletService.getAll().then(data => {
      this.wallets = data;
      this.setCurrentWallet(0);
    });
  }

  getAvailableCurrencies(): Promise<void> {
    return this.walletService.getAvailableCurrencies().then(data => {
      if (data === undefined) {
        if (this.loadingCtrl !== undefined) {
          this.loading.dismiss();
          this.loadingError = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Error retrieving wallet data... API has issues. Please try again later.',
            buttons: ['OK']
          });
          this.loadingError.present();
        }
      } else {
        let json = JSON.parse(JSON.stringify(data));
        for (let i = 0; i < json.length; i++) {
          this.availableCurrencies.push(json[i].currency);
        }
        if (this.availableCurrencies !== undefined) {
          this.pickedCurrency = this.availableCurrencies[0];
        }
      }
    });
  }

  getWalletCurrency(publicKey: string): Promise<void> {
    return this.walletService.getWalletCurrency(publicKey).then(data => {
      let json = JSON.parse(JSON.stringify(data));
      if (Object.keys(json).length === 0) {
        this.loading.dismiss();
        this.loadingError = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'Error retrieving wallet data... API has issues. Please try again later.',
          buttons: ['OK']
        });
        this.loadingError.present();
      } else {
        let currencies = [];
        for (let i = 0; i < json.storedCoins.length; i++) {
          let currency: string = json.storedCoins[i].currency;
          let amount: number = json.storedCoins[i].amount;
          currencies.push({currency: currency, amount: amount});
        }
        if (this.currentWallet !== undefined) {
          this.currentWallet.currencies = currencies;
          this.setCalculatedCurrencyValue();
        }
      }
    });
  }

  setCalculatedCurrencyValue(): Promise<void> {
    if (this.pickedCurrency === undefined || this.currentWallet === undefined) {
      return Promise.resolve();
    }
    return this.walletService.getCurrencyValue(this.pickedCurrency).then(data => {
      let json = JSON.parse(JSON.stringify(data));
      let totalValue: number = 0;
      let totalCurrencies: number = 0;
      this.currenciesForDoughnutCanvasCurrencies = [];
      this.currenciesForDoughnutCanvas = [];
      for (let i = 0; i < json.length; i++) {
        let currencyFromApi = json[i].currencyFrom;
        let valueApi = json[i].value;
        for (let y = 0; y < this.currentWallet.currencies.length; y++) {
          if (currencyFromApi === this.currentWallet.currencies[y].currency) {
            totalValue += (this.currentWallet.currencies[y].amount * valueApi);
            if (this.currenciesForDoughnutCanvasCurrencies.indexOf(this.currentWallet.currencies[y].currency) === -1) {
              this.currenciesForDoughnutCanvasCurrencies.push(String(this.currentWallet.currencies[y].currency));
              this.currenciesForDoughnutCanvas.push(Number(this.currentWallet.currencies[y].amount));
              totalCurrencies += this.currentWallet.currencies[y].amount;
            } 
            break;
          }
        }
      }
      for (let i = 0; i < this.currenciesForDoughnutCanvas.length; i++) {
        let percentage = Number(((100 / totalCurrencies) * this.currenciesForDoughnutCanvas[i]).toFixed(2));
        this.currenciesForDoughnutCanvas[i] = percentage;
      }
      let fixedNumbers = 7;
      if (this.pickedCurrency === "$") {
        fixedNumbers = 2;
      }
      this.currentWallet.totalCurrentCurrencyValue = Number(totalValue.toFixed(fixedNumbers));
      this.displayChart();
      if (this.doughnutChart !== undefined) {
        this.legendList = this.doughnutChart.generateLegend();
      }
      if (this.loadingCtrl !== undefined) {
        this.loading.dismiss();
      }
    });
  }

  openLandingPage(): void {
    this.navCtrl.push(LandingPage);
  }

  settingsClick(): void {
    this.navCtrl.push(SettingsGeneralPage);
  }

  setCurrentWallet(index): boolean {
    if (index < this.wallets.length) {
      this.loading = this.loadingCtrl.create({
        content: 'Loading wallet...'
      });
      this.loading.present();
      this.currentWalletIndex = index;
      this.currentWallet = this.wallets[this.currentWalletIndex];
      this.getWalletCurrency(this.currentWallet.publicKey);
      return true;
    } else {
      this.openLandingPage();
      let toast = this.toastCtrl.create({
        message: 'You deleted all your wallets. Returning to main screen.',
        duration: 5000,
        position: "Bottom"
      });
      toast.present();
      return false;
    }
  }
 
  displayChart(): boolean {
    if (this.currenciesForDoughnutCanvasCurrencies === undefined || 
        this.currenciesForDoughnutCanvasCurrencies === undefined || 
        this.doughnutCanvas === undefined) {
      return false;
    }
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: this.currenciesForDoughnutCanvas,
          backgroundColor: [
            '#FFCD55',
            '#36A1EB'
          ]
        }],
        labels: this.currenciesForDoughnutCanvasCurrencies
      },
      options: {
        legend: {
          display: false
        },
        legendCallback: function(chart) {
          let text = [];
          for (let i= 0; i < chart.data.datasets[0].data.length; i++) {
              text.push({backgroundColor: chart.data.datasets[0].backgroundColor[i],
                         label: chart.data.labels[i],
                         data: chart.data.datasets[0].data[i]});
          }
          return text;
        },
        title: {
          display: false
        }
      }
    });
    return true;
  }
}
