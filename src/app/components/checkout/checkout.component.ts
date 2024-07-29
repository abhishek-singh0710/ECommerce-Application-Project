import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Country } from "src/app/common/country";
import { Order } from "src/app/common/order";
import { OrderItem } from "src/app/common/order-item";
import { Purchase } from "src/app/common/purchase";
import { State } from "src/app/common/state";
import { CartService } from "src/app/services/cart.service";
import { CheckoutService } from "src/app/services/checkout.service";
import { Luv2ShopFormService } from "src/app/services/luv2-shop-form.service";
import { ShopValidators } from "src/app/validators/shop-validators";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.css"],
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

  constructor(
    private formBuilder: FormBuilder,
    private formService: Luv2ShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.reviewCartDetails();

    // Read the user's email address from the Browser Session Storage and then use it to pre-populate the email id address field in the Checkout Form
    const theEmail = JSON.parse(this.storage.getItem("userEmail")!);

    this.checkoutFormGroup = this.formBuilder.group({
      // customer: this.formBuilder.group({
      //   firstName: [''],
      //   lastName: [''],
      //   email: ['']
      // }),
      customer: this.formBuilder.group({
        firstName: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhitespace,
        ]),
        lastName: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhitespace,
        ]),
        email: new FormControl(theEmail, [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ]),
      }),

      shippingAddress: this.formBuilder.group({
        street: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhitespace,
        ]),
        city: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhitespace,
        ]),

        state: new FormControl("", [Validators.required]), // Since dropdown list so no need for checking the writing validators only using required
        country: new FormControl("", [Validators.required]),

        zipCode: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhitespace,
        ]),
      }),

      // creditCard: this.formBuilder.group({
      //   cardType: new FormControl("", [Validators.required]),
      //   nameOnCard: new FormControl("", [
      //     Validators.required,
      //     Validators.minLength(2),
      //     ShopValidators.notOnlyWhitespace,
      //   ]),
      //   cardNumber: new FormControl("", [Validators.pattern("[0-9]{16}")]),
      //   securityCode: new FormControl("", [Validators.pattern("[0-9]{3}")]),
      //   expirationMonth: [""],  // No need to apply validators since they are pre-populated
      //   expirationYear: [""],
      // }),

      billingAddress: this.formBuilder.group({
        street: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhitespace,
        ]),
        city: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhitespace,
        ]),

        state: new FormControl("", [Validators.required]), // Since dropdown list so no need for checking the writing validators only using required
        country: new FormControl("", [Validators.required]),

        zipCode: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhitespace,
        ]),
      }),
    });

    // // Populate credit card months
    // const startMonth: number = new Date().getMonth() + 1;
    // console.log("startMonth: " + startMonth);

    // this.formService.getCreditCardMonths(startMonth).subscribe((data) => {
    //   console.log("Retrieved credit card months: " + JSON.stringify(data));
    //   this.creditCardMonths = data;
    // });
    // // Here it is being done for the first time
    // // after this in the handleMonthsAndYears() method it is being done when there is any change in the selected year in the dropdown list of the years in the credit card form

    // // Populate Credit Card Years
    // this.formService.getCreditCardYears().subscribe((data) => {
    //   console.log("Retrieved credit card months: " + JSON.stringify(data));
    //   this.creditCardYears = data;
    // });

    //Populate Countries  Add the data for the countries in the dropdown list
    this.formService.getCountries().subscribe((data) => {
      console.log("Retrieved Countries" + JSON.stringify(data));
      this.countries = data;
    });
  }

  get firstName() {
    return this.checkoutFormGroup.get("customer.firstName");
  }
  get lastName() {
    return this.checkoutFormGroup.get("customer.lastName");
  }
  get email() {
    return this.checkoutFormGroup.get("customer.email");
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get("shippingAddress.street");
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get("shippingAddress.city");
  }
  get shippingAddressState() {
    return this.checkoutFormGroup.get("shippingAddress.state");
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get("shippingAddress.zipCode");
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get("shippingAddress.country");
  }

  // Getter Methods For Billing Address
  get billingAddressStreet() {
    return this.checkoutFormGroup.get("billingAddress.street");
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get("billingAddress.city");
  }
  get billingAddressState() {
    return this.checkoutFormGroup.get("billingAddress.state");
  }
  get billingAddressZipCode() {
    return this.checkoutFormGroup.get("billingAddress.zipCode");
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup.get("billingAddress.country");
  }

  get creditCardType() { return this.checkoutFormGroup.get("creditCard.cardType");}
  get creditCardNameOnCard() { return this.checkoutFormGroup.get("creditCard.nameOnCard");}
  get creditCardNumber() { return this.checkoutFormGroup.get("creditCard.cardNumber");}
  get creditCardSecurityCode() { return this.checkoutFormGroup.get("creditCard.securityCode");}

  copyShippingAddressToBillingAddress(event: any) {
    // if(event.target.checked) {
    //   this.checkoutFormGroup.controls['billingAddress'] .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
    // }
    // else {  // If not checked then we want to reset
    //   this.checkoutFormGroup.controls['billingAddress'].reset();
    // }

    console.log(event.target.checked);

    if (event.target.checked) {
      this.checkoutFormGroup.controls["billingAddress"].setValue(
        this.checkoutFormGroup.controls["shippingAddress"].value
      );

      // Now for the states and the countries also
      this.billingAddressStates = this.shippingAddressStates;
      this.checkoutFormGroup.controls["billingAddress"]
        .get("country")
        ?.setValue(
          this.checkoutFormGroup.controls["shippingAddress"].get("country")
            ?.value
        );
    } else {
      this.checkoutFormGroup.controls["billingAddress"].reset();

      this.billingAddressStates = [];
    }
  }


  onSubmit() {
    console.log("Handling The Submit Button");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched(); // This will mark all the fields as touched and so all the error messages will be triggered and displayed
      return;
    }

    // Set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get Cart Items
    const cartItems = this.cartService.cartItems;

    // Create orderItems from cartItems

                 // -Long Way
    // let orderItems: OrderItem[] = [];
    // for(let i=0; i<cartItems.length; i++) {
    //   orderItems[i] = new OrderItem(cartItems[i]);
    // }

                            // Short Way of doing the same thing
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // Set up purchase
    let purchase = new Purchase();

    // populate purchase - Customer
    purchase.customer = this.checkoutFormGroup.controls["customer"].value;

    //populate purchase - Shipping Address
    purchase.shippingAddress = this.checkoutFormGroup.controls["shippingAddress"].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - Billing Address
    purchase.billingAddress = this.checkoutFormGroup.controls["shippingAddress"].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.billingAddress.state = shippingState.name;
    purchase.billingAddress.country = shippingCountry.name;

    // populate purchase - Order And OrderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // // Call the REST API via the CheckoutService
    // this.checkoutService.placeOrder(purchase, this.totalPrice).subscribe(
    //   {
    //     next: response => {
    //       alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

    //       // Reset the cart
    //       this.resetCart();
    //     },
    //     error: err => {
    //       alert(`There was an error: ${err.message}`);
    //     }
    // })

    // First call the transaction API If Successfull Then Call The Purchase API
    this.checkoutService.createTransaction(this.totalPrice).subscribe(
      (response) => {
        console.log("Hello here is the response");
        console.log(response);
        this.checkoutService.openTransactionModal(response);
        
        this.checkoutService.modalResponse.subscribe(
          (modalResponse) => {
            if(modalResponse.success) {
              purchase.paymentId = modalResponse.response.razorpay_payment_id;
              this.checkoutService.placeOrder(purchase, this.totalPrice).subscribe(
                {
                  next: response => {
                    alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
            
                    // Reset the cart
                    this.resetCart();
                  },
                  error: err => {
                    alert(`There was an error: ${err.message}`);
                  }
                }
              );
            } else {
              console.log("No Transaction Done");
              alert("Transaction Failed. Order Not Placed.\n Please Try Again")
            }
          }
        )
      },
      (error) => {
        console.log("Here Is The Error " + error);
      }
    )
  }


  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);     // Send the data 0 to the totalPrice and the totalQuantity Subscribers of the Subject for the totalPrice and the totalQuantity
    this.cartService.totalQuantity.next(0);

    // This will be since after we place the order the cart items will be empty so we need to persist the cart items
    // so that on reload also it remains empty so this will help in persisting the current state of the cart(empty) to the local storage
    this.cartService.persistCartItems();

    // reset form data
    this.checkoutFormGroup.reset();

    // navigate back to the main products page
    this.router.navigateByUrl("/products");
  }

  // handleMonthsAndYears() {
  //   console.log("Hello");

  //   const creditCardFormGroup = this.checkoutFormGroup.get("creditCard");
  //   const currentYear: number = new Date().getFullYear();
  //   const selectedYear: number = Number(
  //     creditCardFormGroup?.value.expirationYear
  //   );

  //   // If the current year is equal to the selected year then start with the current month
  //   // Otherwise start with the first month and go for all the twelve months

  //   let startMonth: number;

  //   if (currentYear === selectedYear) {
  //     startMonth = new Date().getMonth() + 1;
  //   } else {
  //     startMonth = 1;
  //   }

  //   this.formService.getCreditCardMonths(startMonth).subscribe((data) => {
  //     console.log("Retrieved Credit Card Months: " + JSON.stringify(data));
  //     this.creditCardMonths = data;
  //   });
  // }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName); // By Using The string sent in the change event function we can get the form group and then we can get that Country's Code And That Country's Name

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name; // This is not required for calling the API It is just for debugging the code

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.formService.getStates(countryCode).subscribe((data) => {
      // We cannot use the same data for both the shipping address and the billing address since they can have different countries so different states also
      if (formGroupName === "shippingAddress") {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }

      // Select first item by default
      formGroup?.get("state")?.setValue(data[0]);
    });
  }

  reviewCartDetails() {
     // Subscribe to the cartService.totalQuantity and the cartService.totalPrice
     this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
     );

     this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
     );
  }
}
