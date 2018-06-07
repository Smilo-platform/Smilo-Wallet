import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Chart } from 'chart.js';
import { WalletService } from '../../services/wallet-service/wallet-service';
import { IWallet, WalletType } from "../../models/IWallet";
import { ICurrency } from '../../models/ICurrency';
import { AlertController } from 'ionic-angular';
import { trigger, state, style, animate, transition } from '@angular/animations';

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
  title = "Wallet Overview";
  pickedCurrency = "$";
  yellows: number;
  blues: number;
  currencyAmount: number;
  smiloWorthPerCoin: number;
  smiloPayWorthPerCoin: number;
  doughnutChart: any;
  wallets: any = [];
  currenciesForDoughnutCanvas: any = [];
  currenciesForDoughnutCanvasCurrencies: any = [];
  currentWallet: any;
  currentWalletIndex = 0;
  legendList: string[];
  availableCurrencies: string[] = [];
  showFundsStatus: boolean = true;
  twoFactorStatus: boolean = false;
  visibility: string = 'shown';


  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public walletService: WalletService,
              public alertCtrl: AlertController) {
    this.currentWallet = "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ";
    this.getAllWallets();
    this.getAvailableCurrencies();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad WalletOverviewPage");
  }

  showFundsSwitch() {
    console.log("Show funds switch: " + this.showFundsStatus);
    if (this.visibility === "shown") {
      this.visibility = "hidden";
    } else if (this.visibility === "hidden") {
      this.visibility = "shown";
    }
  }

  twoFactorStatusSwitch() {
    console.log("Two factor switch: " + this.twoFactorStatus);
  }

  backupWalletClick() {
    console.log("Backup wallet click!");
  }

  deleteWalletClick() {
    console.log("Delete wallet click!");
    const confirm = this.alertCtrl.create({
      title: 'Delete wallet',
      message: "Are you <b>sure</b> you want to delete this wallet ('" + this.currentWallet.publicKey + "')?",
      buttons: [
        {
          text: 'No, cancel',
          handler: () => {
            console.log('No, cancel delete wallet!');
          }
        },
        {
          text: 'Yes, delete',
          cssClass: 'deleteButtonCss',
          handler: () => {
            console.log('Delete wallet now!');
          }
        }
      ]
    });
    confirm.present();
  }

  getAllWallets() {
    this.walletService.getWallets().then(data => {
      var json = JSON.parse(JSON.stringify(data));
      this.wallets = json;
      this.setCurrentWallet(0);
      this.setCalculatedCurrencyValue();
    });
  }

  getAvailableCurrencies() {
    this.walletService  .getAvailableCurrencies().then(data => {
      var json = JSON.parse(JSON.stringify(data));
      for (var i = 0; i < json.length; i++) {
        this.availableCurrencies.push(json[i].currency);
      }
    });
  }

  getWalletCurrency(publicKey: string) {
    this.walletService.getWalletCurrency(publicKey).then(data => {
      var json = JSON.parse(JSON.stringify(data));
      if (Object.keys(json).length === 0) {
        console.log("Fail!");
      } else {
        console.log("Success!");
        console.log(json);
        var currencies = [];
        for (var i = 0; i < json.storedCoins.length; i++) {
          let currency: string = json.storedCoins[i].currency;
          let amount: number = json.storedCoins[i].amount;
          currencies.push({currency: currency, amount: amount});
        }
        this.currentWallet.currencies = currencies;
        this.setCalculatedCurrencyValue();
      }
    });
  }

  setCalculatedCurrencyValue() {
    this.walletService.getCurrencyValue(this.pickedCurrency).then(data => {
      var json = JSON.parse(JSON.stringify(data));
      var totalValue: number = 0;
      var totalCurrencies: number = 0;
      this.currenciesForDoughnutCanvasCurrencies = [];
      this.currenciesForDoughnutCanvas = [];
      for (var i = 0; i < json.length; i++) {
        var currencyFromApi = json[i].currencyFrom;
        var valueApi = json[i].value;
        for (var y = 0; y < this.currentWallet.currencies.length; y++) {
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
      for (var i = 0; i < this.currenciesForDoughnutCanvas.length; i++) {
        var percentage = ((100 / totalCurrencies) * this.currenciesForDoughnutCanvas[i]).toFixed(2);
        this.currenciesForDoughnutCanvas[i] = percentage;
      }
      var fixedNumbers = 7;
      if (this.pickedCurrency === "$") {
        fixedNumbers = 2;
      }
      this.currentWallet.totalCurrentCurrencyValue = totalValue.toFixed(fixedNumbers);
      this.displayChart();
      this.legendList = this.doughnutChart.generateLegend();
    });
  }

  setCurrentWallet(index) {
    this.currentWalletIndex = index;
    this.currentWallet = this.wallets[this.currentWalletIndex];
    this.getWalletCurrency(this.currentWallet.publicKey);
  }
 
  displayChart() {
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
          var text = [];
          for (var i= 0; i < chart.data.datasets[0].data.length; i++) {
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
