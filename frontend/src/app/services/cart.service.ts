import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {
    // check if we already have item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      // find the item based on id

      
      // for (let tempCartItem of this.cartItems) {
      //   if (tempCartItem.id === theCartItem.id) {
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }

      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id );

      // check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if(alreadyExistsInCart){
      //increment the quantity
      existingCartItem.quantity++;
    }
    else{
      // add item to array
      this.cartItems.push(theCartItem);
    }

    //compute cart total price and total qty

    this.computeCarTotals();
  }
  computeCarTotals() {
    let totalPriceValue: number = 0;
    let totalQuantity: number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantity += currentCartItem.quantity;
    }

    //publish the new values 
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantity);

    // log cart data for debugging

    this.logCartData(totalPriceValue,totalQuantity);
  }


  logCartData(totalPriceValue: number, totalQuantity: number) {
    console.log('contents of the cart');
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.unitPrice * tempCartItem.quantity;
      console.log(`name : ${tempCartItem.name}, 
      qty: ${tempCartItem.unitPrice},
      price:${tempCartItem.quantity}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)},totalQuantity: ${totalQuantity}`);
    console.log('---------');
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity -- ;
    //remove from cart if value is <0
    if(theCartItem.quantity == 0){
      this.remove(theCartItem);
    }
    else{
      this.computeCarTotals();
    }
  }
  remove(theCartItem: CartItem) {
    // get the index of the item in the array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id == theCartItem.id);


    //if found , remove the item
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex,1);
      this.computeCarTotals();
    }
  }
}
