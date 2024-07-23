import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    // Get a handle to the Cart Items
    this.cartItems = this.cartService.cartItems;


    // Will Subscribe to the cart total price so that it sees any change in the Total Price Of The Shopping Cart
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    // Will Subscribe To The Cart Total Quantity so that it sees any change in the Total Quantity Of The Shopping Cart
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );


    // Will Compute The Cart Total Price And Quantity
    this.cartService.computeCartTotals();
  }

  incrementQuantity(theCartItem: CartItem) {
    // Just adding the Cart Item It will take be done by the case where the cart item already exists in the Shopping Cart
    this.cartService.addToCart(theCartItem);
    }

    decrementQuantity(theCartItem: CartItem) {
      this.cartService.decrementQuantity(theCartItem);
      }

      removeItem(theCartItem: CartItem) {
        this.cartService.remove(theCartItem);
        }
}
