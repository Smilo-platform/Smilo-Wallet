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
import { TransferPage } from "../transfer/transfer";
import { RestoreBackupPage } from "../restore-backup/restore-backup";
import { IAvailableExchange } from "../../models/IAvailableExchange";

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
  pickedExchange: string;
  doughnutChart: Chart;
  wallets: IWallet[] = [];
  currenciesForDoughnutCanvas: number[] = [];
  currenciesForDoughnutCanvasLabels: string[] = [];
  currentWallet: IWallet;
  currentWalletIndex: number = 0;
  legendList: string[] = [];
  availableExchanges: IAvailableExchange[] = [];
  currentExchangeCurrencies: string[] = [];
  showFundsStatus: boolean = true;
  twoFactorStatus: boolean = false;
  walletFundsVisibility: VisibilityType = 'shown';
  walletFundsVisibilityTransferButton: VisibilityType = "hidden";
  loading: Loading;
  loadingError: Alert;
  totalCurrentCurrencyValue: number;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public walletService: WalletService,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController) {

  }
  
  /**
   * Returns a promise when initialization is done
   */
  initialize(): Promise<void> {
    return Promise.all([this.getAllWallets(), 
                        this.getAvailableExchanges()]).then<void>();
  }

  /**
   * Called whenever the view is loaded
   */
  ionViewDidLoad(): void {
    this.initialize();
  }
  
  /**
   * Called when pressing the funds switch
   */
  fundsSwitch(): void {
    if (this.walletFundsVisibility === "shown") {
      this.walletFundsVisibility = "hidden";
      this.walletFundsVisibilityTransferButton = "shown";
    } else if (this.walletFundsVisibility === "hidden") {
      this.walletFundsVisibility = "shown";
      this.walletFundsVisibilityTransferButton = "hidden";
    }
  }

  /**
   * Open the transfer page
   */
  transfer(): void {
    this.navCtrl.push(TransferPage);
  }

  /**
   * Open the backup wallet page
   */
  backupWallet(): void {
    this.navCtrl.push(RestoreBackupPage);
  }

  /**
   * Open a modal to delete the wallet
   */
  deleteWallet(): void {
    const confirm = this.alertCtrl.create({
      title: 'Delete wallet',
      message: "Are you <b>sure</b> you want to delete wallet '" + this.currentWallet.name + "' ('" + this.currentWallet.publicKey + "')?",
      buttons: [
        {
          text: 'No, cancel',
          handler: () => {
            
          }
        },
        {
          text: 'Yes, delete',
          cssClass: 'delete-button',
          handler: () => {
            this.walletService.remove(this.currentWallet);
            this.deleteSelectedWallet(this.currentWallet);
          }
        }
      ]
    });
    confirm.present();
  }

  /**
   * Delete a wallet from the UI and local database
   * @param wallet The wallet to delete
   */
  deleteSelectedWallet(wallet: IWallet): boolean {
    let index = this.wallets.indexOf(wallet);
    if (index !== -1) {
      this.wallets.splice(index, 1);
      if (this.wallets.length > 0) {
        this.currentWallet = this.wallets[0];
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
    } else {
      return false;
    }
  }

  /**
   * Retrieve all wallets saved in the local database
   */
  getAllWallets(): Promise<void> {
    return this.walletService.getAll().then(data => {
      this.wallets = data;
      this.currentWallet = this.wallets[0];
    });
  }

  /**
   * Get all available exchanges that support XSM and XMP and their corresponding available currencies
   */
  getAvailableExchanges(): Promise<void> {
    return this.walletService.getAvailableExchanges().then(data => {
      for (let i = 0; i < data.availableExchanges.length; i++) {
        this.availableExchanges.push(data.availableExchanges[i]);
      }
      if (this.availableExchanges !== undefined) {
        this.pickedExchange = this.availableExchanges[0].exchangeName;
        this.pickedCurrency = this.availableExchanges[0].availableCurrencies[0];
        this.currentExchangeCurrencies = this.availableExchanges[0].availableCurrencies;
      }
    });
  }
  
  /**
   * Retrieve the wallet balance
   * @param publicKey The public key of the wallet to retrieve the balance
   */
  getWalletBalance(publicKey: string): Promise<void> {
    this.loading = this.loadingCtrl.create({
      content: 'Loading wallet...'
    });
    this.loading.present();
    return this.walletService.getWalletBalance(publicKey).then(data => {
      let json = JSON.parse(JSON.stringify(data));
      let balances = [];
      if (json === null || Object.keys(json).length === 0) {
        balances.push({currency: "XSM", amount: Number(0), valueAmount: Number(0)});
        balances.push({currency: "XSP", amount: Number(0), valueAmount: Number(0)});
      } else {
        for (let i = 0; i < json.storedCoins.length; i++) {
          let currency: string = json.storedCoins[i].currency;
          let amount: number = json.storedCoins[i].amount;
          balances.push({currency: currency, amount: amount});
        }
      }
      if (this.currentWallet !== undefined) {
        this.currentWallet.balances = balances;
        this.setCalculatedCurrencyValue();
      }
    });
  }

  /**
   * Change the current exchange and set the currency values for that exchange
   */
  setExchange(): void {
    this.currentExchangeCurrencies = this.availableExchanges.find(exchange => exchange.exchangeName === this.pickedExchange).availableCurrencies;
    let index = this.currentExchangeCurrencies.indexOf(this.pickedCurrency);
    if (index === -1) {
      this.pickedCurrency = this.currentExchangeCurrencies[0];
    }
    this.setCalculatedCurrencyValue();
  }
  
  /**
   * Get the amount of decimals. Using a shorter decimal amount for FIAT
   */
  getFixedNumbers() {
    let fixedNumbers = 7;
    if (this.pickedCurrency === "USD" ||
        this.pickedCurrency === "€") {
      fixedNumbers = 2;
    }
    return fixedNumbers;
  }

  /**
   * Set the currency values calculated on the exchange, currency and amount of coins
   */
  setCalculatedCurrencyValue(): Promise<void> {
    if (this.pickedCurrency === undefined || this.currentWallet === undefined) {
      return Promise.resolve();
    }
    return this.walletService.getPrices(this.pickedCurrency, this.pickedExchange).then(data => {
      let prices = JSON.parse(JSON.stringify(data));
      let totalValue: number = 0;
      let totalCurrencies: number = 0;
      this.currenciesForDoughnutCanvasLabels = [];
      this.currenciesForDoughnutCanvas = [];
      // Loop all balances of current wallet
      for (let y = 0; y < this.currentWallet.balances.length; y++) {
        let walletCurrency = this.currentWallet.balances[y].currency;
        let walletCurrencyAmount = this.currentWallet.balances[y].amount;
        // Loop all prices
        for (let i = 0; i < prices.length; i++) {
          let currencyFromApi = prices[i].currencyFrom;
          let currencyToApi = prices[i].currencyTo;
          let valueApi = prices[i].value;
          let currentCurrencyValue = 0;
          let found = false;
          // If there is a value in the prices array that matches the from and to currency 1 to 1
          if (currencyFromApi === walletCurrency && currencyToApi === this.pickedCurrency) {
            currentCurrencyValue = walletCurrencyAmount * valueApi;
            found = true;
          }
          // So there was no price found for the current wallet currency
          if (i === prices.length -1 && !found) {
            // TODO: If alternate price is also not found
            let alternatePrice = prices.find(price => price.currencyFrom === currencyToApi && price.currencyTo === this.pickedCurrency);
            if (currencyToApi === this.pickedCurrency) {
              alternatePrice = 1;
              currentCurrencyValue = alternatePrice * walletCurrencyAmount;
            } else if (alternatePrice === undefined) {
              alternatePrice = 0;
              if (y === 0) {
                const alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: 'Could not determine currency value, setting to 0.',
                  buttons: ['OK']
                });
                alert.present();
              }
            } else {
              alternatePrice = alternatePrice.value;
              currentCurrencyValue = alternatePrice * valueApi * walletCurrencyAmount;
            }
            found = true;
          }
          if (found) {
            totalValue += currentCurrencyValue;
            
            this.currenciesForDoughnutCanvasLabels.push(String(walletCurrency));
            this.currenciesForDoughnutCanvas.push(Number(walletCurrencyAmount));

            totalCurrencies += walletCurrencyAmount;
            this.currentWallet.balances[y].valueAmount = Number((currentCurrencyValue).toFixed(this.getFixedNumbers()));
            break;
          } else if (!found && i === prices.length -1) {
            // TODO: Didn't find an alternative path
            console.log("Not found: " + walletCurrency);
          }
        }
      }
      // Loop the entire canvas data array
      for (let i = 0; i < this.currenciesForDoughnutCanvas.length; i++) {
        // If the data array is not zero
        if (this.currenciesForDoughnutCanvas[i] !== 0) {
          this.currenciesForDoughnutCanvas[i] = Number(((100 / totalCurrencies) * this.currenciesForDoughnutCanvas[i]).toFixed(2));
        }
      }
      if (totalCurrencies === 0) {
        let amountOfCurrencies  = this.currenciesForDoughnutCanvas.length;
        this.currenciesForDoughnutCanvas = [];
        for (let i = 0; i < amountOfCurrencies; i++) {
          this.currenciesForDoughnutCanvas.push(100 / amountOfCurrencies);
        }
      }
      this.totalCurrentCurrencyValue = Number(totalValue.toFixed(this.getFixedNumbers()));
      this.displayChart();
      if (this.doughnutChart !== undefined) {
        this.legendList = this.doughnutChart.generateLegend();
      }
      this.loading.dismiss();
    });
  }

  /**
   * Open the landing page
   */
  openLandingPage(): void {
    this.navCtrl.push(LandingPage);
  }

  /**
   * Open the settings page
   */
  settingsClick(): void {
    this.navCtrl.push(SettingsGeneralPage);
  }

  /**
   * Whenever the current wallet is changed
   */
  onWalletChanged() {
    this.getWalletBalance(this.currentWallet.publicKey);
  }
  
  /**
   * Show the distribution chart. False when chart could not be drawn
   */
  displayChart(): boolean {
    if (this.currenciesForDoughnutCanvasLabels === undefined || 
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
        labels: this.currenciesForDoughnutCanvasLabels
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
