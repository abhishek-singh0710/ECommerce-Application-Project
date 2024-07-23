import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl = environment.ecommerceApiUrl + "/checkout/purchase";
  private transactionUrl = "https://localhost:8443/api/checkout/createTransaction/";

  private modalResponseSubject = new Subject<any>();
  modalResponse = this.modalResponseSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

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
    // prepare options  => Like sendind headers
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
      prefills : {
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
      this.modalResponseSubject.next({
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
