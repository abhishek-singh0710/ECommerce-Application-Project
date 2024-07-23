import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countriesUrl = environment.ecommerceApiUrl + "/countries";
  private statesUrl = environment.ecommerceApiUrl + "/states";

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries) 
    )
  }

  getStates(theCountryCode: string): Observable<State[]> {


    // Search URL
    const searchStateUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStateUrl).pipe(
      map(response => response._embedded.states)
    )
  }



  getCreditCardMonths(startMonth: number): Observable<number[]> {

    let data: number[] = [];

    // Build an array for "Month" Dropdown List
    // Start at the current month and loop until

    for (let theMonth = startMonth; theMonth<=12; theMonth++) {
      data.push(theMonth);
    }
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {

    let data: number[] = [];

    // Build an array for "Year" downlist list
    // Start at the current year and loop for the next 10 years

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear=startYear; theYear<=endYear; theYear++) {
      data.push(theYear);
    }
    return of(data);
  }
}

interface GetResponseCountries {
  _embedded: {     // It unwraps the JSON Data from the Spring Data REST _embedded entry
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];  // It unwraps the JSON Data From The Spring Data REST _embedded Entry
  }
}
