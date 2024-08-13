import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderItem } from '../common/order-item';

declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl = environment.ecommerceApiUrl + "/checkout/purchase";
  private transactionUrl = "https://localhost:8443/api/checkout/createTransaction/";
  private checkInInventoryUrl = "https://localhost:8443/api/inventory/getInventory";

  private modalResponseSubject = new Subject<any>();
  modalResponse = this.modalResponseSubject.asObservable();

  constructor(private httpClient: HttpClient) { }


  checkInInventory(orderItems: OrderItem[]): Observable<any> {
    return this.httpClient.post<OrderItem[]>(this.checkInInventoryUrl, orderItems);
  }


  createTransaction(amount: number): Observable<any> {
    return this.httpClient.get<any>(this.transactionUrl + amount);
  }

  placeOrder(purchase: Purchase, totalPrice: number): Observable<any> {
    // this.createTransaction(totalPrice).subscribe(
    //   (response) => {
    //     console.log("Hello");
    //     console.log(response);
    //     this.openTransactionModal(response);
    //   },
    //   (error) => {
    //     console.log("here is the error"+error);
    //   }
    // )
    return this.httpClient.post<Purchase>(this.purchaseUrl,purchase);      // In the Spring Boot Application We are Posting to the API Endpoint URL 
  }

  openTransactionModal(response: any) {
    // prepare options  => Like sending headers
    const amount = Math.round(response.amount * 100);
    console.log(`amount=${amount}`);
    var options = {
      order_id: response.order_id,
      key: response.key,
      amount: amount,
      currency: response.currency,
      name: "Hello",
      description: "Test Payment",
      image: "https://cdn.razorpay.com/logos/7K3b6d18wHwKzL_medium.png",
      handler: (response: any) => {
        this.processResponse(response);
      },
      prefill : {
        name: "Hello",
        email: "hello@gmail.com",
        contact: "5687685687566856"
      },
      notes: {
        address: "ECommerce Application"
      },
      theme: {
        color: "black"
      }
    };

    var razorpayObject = new Razorpay(options);
    razorpayObject.open();
  }

  processResponse(resp: any) {
    console.log(resp);
    if(resp.razorpay_payment_id) {
      console.log(resp.razorpay_payment_id);
      this.modalResponseSubject.next({   // using the next method it will emit the data about success and the subscriber(this.checkoutService.modalResponse in checkout.component.ts) will catch it immediately 
        success: true,
        response: resp
      });
    } else {
      this.modalResponseSubject.next({
        success: false
      });
    }
  }
}
