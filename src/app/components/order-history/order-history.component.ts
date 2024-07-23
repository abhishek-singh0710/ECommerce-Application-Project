import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {

    // read the user's email address from the browser session storage
    const theEmail = JSON.parse(this.storage.getItem("userEmail")!);

    // retrieve the order items for the given user using the Current User's Email Which is stored in the Browser Session Storage
    this.orderHistoryService.getOrderHistory(theEmail).subscribe(
      data => {
        this.orderHistoryList = data._embedded.orders;
      }
    )
  }

}
