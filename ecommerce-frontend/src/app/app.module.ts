import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './pages/cart/cart.component';
import { SuccessComponent } from './pages/success/success.component';
import { FailureComponent } from './pages/failure/failure.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './pages/admin-products/admin-products.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminSalesComponent } from './pages/admin-sales/admin-sales.component';
import {NgChartsModule} from 'ng2-charts';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { SellerPanelComponent } from './pages/seller-panel/seller-panel.component';
import { SellerAddProductComponent } from './pages/seller-add-product/seller-add-product.component';
import { SellerOrdersComponent } from './pages/seller-orders/seller-orders.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    HomeComponent,
    CartComponent,
    SuccessComponent,
    FailureComponent,
    OrderHistoryComponent,
    AdminDashboardComponent,
    AdminProductsComponent,
    AdminUsersComponent,
    AdminSalesComponent,
    ProductDetailComponent,
    SellerPanelComponent,
    SellerAddProductComponent,
    SellerOrdersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgChartsModule
  ],
  providers: [
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
