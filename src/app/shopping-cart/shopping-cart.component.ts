import { Component, OnInit } from '@angular/core';
import {BookStoreService} from '../shared/book-store.service';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {BookFactory} from '../shared/book-factory';
import {Item} from '../shared/item';
import {AuthService} from '../shared/authentification.service';
import {OrderFactory} from '../shared/order-factory';
import {isNullOrUndefined} from "util";

@Component({
  selector: 'bs-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styles: []
})
export class ShoppingCartComponent implements OnInit {

  items: Item[] = [];
  total_brutto = 0;
  total_netto = 0;
  mwst: number = 0;

  book = BookFactory.empty();
  order = OrderFactory.empty();
  cartItems: Item[] = [];

  constructor(private bs: BookStoreService,
              private route: ActivatedRoute, private router:Router,
              private authService : AuthService) { }


  ngOnInit() {
    const params = this.route.snapshot.params;

    this.bs.getSingle(params['isbn']).subscribe(b => {
      let isbn = params['isbn'];

      if (isbn) {
        let item: Item = {
          book: this.book = b,
          quantity: 1
        };
        if (localStorage.getItem('cart') == null) {
          let cart = [];
          cart.push(JSON.stringify(item));
          localStorage.setItem('cart', JSON.stringify(cart));
        } else {
          let cart = JSON.parse(localStorage.getItem('cart'));
          let index = -1;
          for (let i = 0; i < cart.length; i++) {
            let item: Item = JSON.parse(cart[i]);
            if (item.book.isbn == isbn) {
              index = i;
              break;
            }
          }
          if (index == -1) {
            cart.push(JSON.stringify(item));
            localStorage.setItem('cart', JSON.stringify(cart));
          } else {
            let item = JSON.parse(cart[index]);
            item.quantity += 1;
            cart[index] = JSON.stringify(item);
            localStorage.setItem("cart", JSON.stringify(cart));
          }
        }
        this.loadCart();
      }
    });

  }

  loadCart() {
    this.total_brutto = 0;
    this.total_netto = 0;
    this.mwst = 0;

    this.items = [];
    let cart = JSON.parse(localStorage.getItem('cart'));
    for (let i = 0; i < cart.length; i++) {
      let item = JSON.parse(cart[i]);
      this.items.push({
        book: item.book,
        quantity: item.quantity
      });
      this.total_brutto += item.book.price * item.quantity;
      this.total_netto = this.total_brutto/1.1;
      this.mwst = this.total_netto - this.total_brutto;
      this.mwst = Math.abs(this.mwst);
    }
  }

  addOneItem (isbn: string){
    let cart = JSON.parse(localStorage.getItem('cart'));
    let index = -1;
    for (let i = 0; i < cart.length; i++) {
      let item = JSON.parse(cart[i]);
      if (item.book.isbn == isbn) {
        item.quantity += 1;
        cart[i] = JSON.stringify(item);
        break;
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    this.loadCart();
  }

  removeOneItem (isbn: string){
    let cart = JSON.parse(localStorage.getItem('cart'));
    let index = -1;
    for (let i = 0; i < cart.length; i++) {
      let item = JSON.parse(cart[i]);
      if (item.book.isbn == isbn) {
        item.quantity -= 1;
        if(item.quantity > 0){
          cart[i] = JSON.stringify(item);
          break;
        }
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    this.loadCart();
  }

  removeItems(isbn: string) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    let index = -1;
    for (let i = 0; i < cart.length; i++) {
      let item = JSON.parse(cart[i]);
      if (item.book.isbn == isbn) {
        cart.splice(i, 1);
        break;
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    this.loadCart();
  }

  submitOrder() {
    if(!isNullOrUndefined(localStorage.getItem("cart"))){
      if(this.isLoggedIn()) {
        let cart = JSON.parse(localStorage.getItem('cart'));
        for (let i = 0; i < cart.length; i++) {
          let item = JSON.parse(cart[i]);
          this.cartItems.push({
            book: item.book,
            quantity: item.quantity
          });
        }

        this.order.items = this.cartItems;
        this.order.user_id = JSON.parse(localStorage.getItem('userId'));
        this.order.date = new Date(this.order.date);
        this.order.total_brutto = this.total_brutto;
        this.order.total_netto = this.total_netto;

        console.log(this.order);

        this.bs.saveToCart(this.order).subscribe(res =>
        {
          console.log("Saved order");
          console.log(res);

        });

        localStorage.removeItem("cart");
        this.total_brutto = 0;
        this.total_netto = 0;
        this.mwst = 0;
        this.items = [];

      } else {
        this.router.navigate(['../login'], { relativeTo: this.route });
      }
    }
  }

  isLoggedIn(){
    return this.authService.isLoggedIn();
  }

}