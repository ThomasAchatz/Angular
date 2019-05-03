import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {BookListComponent} from './book-list/book-list.component';
import {BookDetailsComponent} from './book-details/book-details.component';
import {BookFormComponent} from './book-form/book-form.component';
import {LoginComponent} from './login/login.component';
import {ShoppingCartComponent} from './shopping-cart/shopping-cart.component';
import {OrdersComponent} from './orders/orders.component';
import {AdminComponent} from './admin/admin.component';
import {AdminDetailComponent} from './admin-detail/admin-detail.component';
import {OrderDetailComponent} from './order-detail/order-detail.component';

const routes: Routes = [
    {path:'', redirectTo: 'home', pathMatch:'full'}, //Standartroute - pathmath full -> es darf nichts dahinter stehen dann darf die route anschlagen!
    {path:'home', component: HomeComponent},
    {path:'books', component: BookListComponent}, //Bücherübersicht
    {path:'books/:isbn', component: BookDetailsComponent}, //Detailansicht
    {path:'add', component: BookFormComponent}, //neu anlegen
    {path:'updateBook/:isbn', component: BookFormComponent}, //editieren
    {path:'login', component: LoginComponent},
    {path:'cart', component: ShoppingCartComponent}, //Warenkorb übersicht
    {path:'cart/:isbn', component: ShoppingCartComponent}, //zum Warenkorb hinzufügen
    {path:'orders', component: OrdersComponent},
    {path:'orders/:order_id', component: OrderDetailComponent},
    {path:'admin', component: AdminComponent},
    {path:'admin/:order_id', component: AdminDetailComponent}
];

@NgModule ({
    //initialisiert die Routen, macht es im System bekannt
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {

}