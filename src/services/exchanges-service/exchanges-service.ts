import { IAvailableExchange } from "../../models/IAvailableExchange";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IExchangePrice } from "../../models/IExchangePrice";

export interface IExchangesService {
    getAvailableExchanges();

    getPrices(currency: string, exchange: string): Promise<IExchangePrice[]>;
}

@Injectable()
export class ExchangesService implements IExchangesService {

    constructor(private http: HttpClient) {}

    getAvailableExchanges(): Promise<{availableExchanges: IAvailableExchange[]}> {
        return this.http.get('assets/json/availableExchanges.json').toPromise().then(data => {
            return <any>data;
        });
    }

    getPrices(currency: string, exchange: string): Promise<IExchangePrice[]> {
        return this.http.get("assets/json/exchangeCurrencyValues.json").toPromise().then(data => {
            var json = JSON.parse(JSON.stringify(data));
            var foundCurrencies: IExchangePrice[] = [];
            for (var i = 0; i < json.length; i++) {
                if (json[i].exchange === exchange) {
                    foundCurrencies.push(json[i]);
                }
            }
            return foundCurrencies;
        });
    }
}