import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Chart } from 'chart.js';
import { Wallet } from '../../entities/wallet';
import { WalletService } from '../../services/wallet-service/wallet-service';

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
})
export class WalletOverviewPage {
  title = "Wallet Overview";
  defaultCurrency = "$";
  @ViewChild('doughnutCanvas') doughnutCanvas;
  yellows: number;
  blues: number;
  doughnutChart: any;
  currencyAmount: number;
  currentWallet: string;
  userWallets: string[];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public walletService: WalletService) {
    this.currencyAmount = 5723.55;
    this.currentWallet = "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ";
    this.getWalletData();
  }

  getWalletData() {
    console.log("Get wallet data: ");
    console.log(this.walletService.getAll());
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad WalletOverviewPage");
    this.yellows = 26.75;
    this.blues = 73.25;
    this.displayChart();
  }

  currencySelected() {
    console.log("WalletOverview: Value currency selected: " + this.defaultCurrency);
    if (this.defaultCurrency === "$") {
      this.currencyAmount = 5723.55;
    } else if (this.defaultCurrency === "ETH") {
      this.currencyAmount = 7.65125;
    } else if (this.defaultCurrency === "BTC") {
      this.currencyAmount = 0.65123;
    }
  }
 
  displayChart() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [this.yellows, this.blues],
          backgroundColor: [
            '#FFCD55',
            '#36A1EB'
          ]
        }]
      },
      options: {
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        title: {
          display: false,
          fontStyle: 'bold',
          fontSize: 18
        }
      },
    });
  }
}
