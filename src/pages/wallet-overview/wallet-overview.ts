import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, LoadingController, Loading } from "ionic-angular";
import { Chart } from 'chart.js';
import { WalletService } from '../../services/wallet-service/wallet-service';
import { AlertController } from 'ionic-angular';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { LandingPage } from "../landing/landing";
import { ToastController } from 'ionic-angular';
import { SettingsGeneralPage } from "../settings-general/settings-general";

/**
 * Generated class for the WalletOverviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
  doughnutChart: any;
  wallets: any = [];
  currenciesForDoughnutCanvas: any = [];
  currenciesForDoughnutCanvasCurrencies: any = [];
  currentWallet: any;
  currentWalletIndex = 0;
  legendList: string[] = [];
  availableCurrencies: string[] = [];
  showFundsStatus: boolean = true;
  twoFactorStatus: boolean = false;
  walletFundsVisibility: string = 'shown';
  loading: Loading;
  loadingError: Loading;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public walletService: WalletService,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController) {
    this.getAllWallets();
    this.getAvailableCurrencies();
  }

  ionViewDidLoad() {
    
  }

  fundsSwitch() {
    if (this.walletFundsVisibility === "shown") {
      this.walletFundsVisibility = "hidden";
      this.showFundsStatus = false;
    } else if (this.walletFundsVisibility === "hidden") {
      this.walletFundsVisibility = "shown";
      this.showFundsStatus = true;
    }
  }

  twoFactorStatusSwitch() {
    if (this.twoFactorStatus) {
      this.twoFactorStatus = false;
    } else {
      this.twoFactorStatus = true;
    }
  }

  backupWalletClick() {

  }

  deleteWalletClick() {
    if (this.currentWallet === null || this.currentWallet === undefined) {
      return null;
    }
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
            this.deleteSelectedWallet(this.currentWallet.publicKey);
          }
        }
      ]
    });
    if (confirm !== null) {
      confirm.present();
    } else {
      return null;
    }
  }

  deleteSelectedWallet(publicKey: string) {
    let index = -1;
    for (let i = 0; i < this.wallets.length; i++) {
      if (publicKey === this.wallets[i].publicKey) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      this.wallets.splice(index, 1);
      this.setCurrentWallet(0);
      return true;
    } else {
      return false;
    }
  }

  getAllWallets() {
    this.walletService.getAll().then(data => {
      this.wallets = data;
      this.setCurrentWallet(0);
    });
  }

  getAvailableCurrencies(): Promise<any> {
    return new Promise(resolve => {this.walletService.getAvailableCurrencies().then(data => {
      if (data === undefined) {
        if (this.loadingCtrl !== undefined) {
          this.loading.dismiss();
          this.loadingError = this.loadingCtrl.create({
            content: 'Error retrieving wallet data... API has issues. Please try again later.'
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
      resolve(data);
    })});
  }

  getWalletCurrency(publicKey: string): Promise<any> {
    return new Promise(resolve => { this.walletService.getWalletCurrency(publicKey).then(data => {
      let json = JSON.parse(JSON.stringify(data));
      if (Object.keys(json).length === 0) {
        this.loading.dismiss();
        this.loadingError = this.loadingCtrl.create({
          content: 'Error retrieving wallet data... API has issues. Please try again later.'
        });
        if (this.loadingError !== null) {
          this.loadingError.present();
        }
        resolve(json);
      } else {
        let currencies = [];
        for (let i = 0; i < json.storedCoins.length; i++) {
          let currency: string = json.storedCoins[i].currency;
          let amount: number = json.storedCoins[i].amount;
          currencies.push({currency: currency, amount: amount});
        }
        this.currentWallet.currencies = currencies;
        this.setCalculatedCurrencyValue();
      }
      resolve(json);
    })});
  }

  setCalculatedCurrencyValue() {
    if (this.pickedCurrency === undefined) {
      return new Promise(resolve => {
        resolve([]);
      });
    }
    return new Promise(resolve => {this.walletService.getCurrencyValue(this.pickedCurrency).then(data => {
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
              this.currenciesForDoughnutCanvasCurrencies.push(this.currentWallet.currencies[y].currency);
              this.currenciesForDoughnutCanvas.push(this.currentWallet.currencies[y].amount);
              totalCurrencies += this.currentWallet.currencies[y].amount;
            } 
            break;
          }
        }
      }
      for (let i = 0; i < this.currenciesForDoughnutCanvas.length; i++) {
        let percentage = ((100 / totalCurrencies) * this.currenciesForDoughnutCanvas[i]).toFixed(2);
        this.currenciesForDoughnutCanvas[i] = percentage;
      }
      let fixedNumbers = 7;
      if (this.pickedCurrency === "$") {
        fixedNumbers = 2;
      }
      this.currentWallet.totalCurrentCurrencyValue = totalValue.toFixed(fixedNumbers);
      this.displayChart();
      if (this.doughnutChart !== undefined) {
        this.legendList = this.doughnutChart.generateLegend();
      }
      if (this.loadingCtrl !== undefined) {
        this.loading.dismiss();
      }
      resolve(json);
    })});
  }

  openLandingPage() {
    this.navCtrl.push(LandingPage);
  }

  settingsClick() {
    console.log("CLICK!");
    this.navCtrl.push(SettingsGeneralPage);
  }

  setCurrentWallet(index) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading wallet...'
    });
    this.loading.present();
    if (index < this.wallets.length) {
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
      if (toast !== null) {
        toast.present(toast);
      }
      return false;
    }
  }
 
  displayChart() {
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
      },
    });
  }
}
