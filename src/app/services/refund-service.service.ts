import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RefundServiceService {

  baseUrl: string = environment.ecommerceApiUrl + "/payment";
  constructor(private httpClient: HttpClient) { }

  refund(orderId: string, email: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/refund`, {orderId, email});
  }
}
