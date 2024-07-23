import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { from, lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  // from HttpInterceptor         Code is written here only the function is implemented
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    return from(this.handleAccess(req, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {

  const theEndpoint = environment.ecommerceApiUrl + "/orders";
  // Only add an access token for the secured endpoints the orders API
  const securedEndpoints: string[] = [theEndpoint];

  // If the URL that is being processed matches with any URL that is provided in the secured endpoints array
  if(securedEndpoints.some(url => request.urlWithParams.includes(url))) {
     
    // get the access token
    const accessToken = this.oktaAuth.getAccessToken();

    // clone this request and then add the access token in the Request Header
    request = request.clone({
      setHeaders: {
        Authorization: "Bearer " + accessToken
      }
    });

  }
  // send the request to the next interceptor if any otherwise make the call the given REST API
  return await lastValueFrom(next.handle(request));
  }

}
