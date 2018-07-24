import { Component } from "@angular/core";
import { IonicPage } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-faq",
  templateUrl: "faq.html",
})
export class FaqPage {
  items: any = [];

  constructor() {
    this.items = [
      {expanded: false},
      {expanded: false},
      {expanded: false},
      {expanded: false},
      {expanded: false}
    ];
  }

  expandItem(item){
    this.items.map((listItem) => {
      if(item == listItem){
        listItem.expanded = !listItem.expanded;
      } else {
        listItem.expanded = false;
      }
      return listItem;
    });
  }
}
