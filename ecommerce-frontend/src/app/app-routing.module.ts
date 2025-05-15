import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {HomeComponent} from './pages/home/home.component';
import {AuthGuard} from './guards/auth.guard';
import {CartComponent} from './pages/cart/cart.component';
import {SuccessComponent} from './pages/success/success.component';
import {FailureComponent} from './pages/failure/failure.component';
import {OrderHistoryComponent} from './pages/order-history/order-history.component';
import {AdminDashboardComponent} from './pages/admin-dashboard/admin-dashboard.component';
import {AdminProductsComponent} from './pages/admin-products/admin-products.component';
import {AdminSalesComponent} from './pages/admin-sales/admin-sales.component';
import {AdminGuard} from './guards/admin.guard';
import {AdminUsersComponent} from './pages/admin-users/admin-users.component';
import {fixGuard} from './guards/fix.guard';
import {ProductDetailComponent} from './pages/product-detail/product-detail.component';
import {SellerPanelComponent} from './pages/seller-panel/seller-panel.component';
import {SellerGuard} from './guards/seller.guard';
import {SellerAddProductComponent} from './pages/seller-add-product/seller-add-product.component';
import {SellerOrdersComponent} from './pages/seller-orders/seller-orders.component';

const routes: Routes = [{path : '', redirectTo: 'login', pathMatch: 'full'},
                        {path: 'login', component: LoginComponent, canActivate: [fixGuard]},
                        {path: 'register', component: RegisterComponent, canActivate: [fixGuard]},
                        {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
                        {path: 'register', component: RegisterComponent, canActivate: [fixGuard]},
                        {path: 'cart', component: CartComponent, canActivate: [AuthGuard]},
                        {path: 'success', component: SuccessComponent},
                        {path: 'failure', component: FailureComponent},
                        {path: 'orders', component: OrderHistoryComponent},
                        {path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard], children : [
                            {path: 'products', component: AdminProductsComponent},
                            {path: 'users', component: AdminUsersComponent},
                            {path: 'sales', component: AdminSalesComponent},
                            {path: '', redirectTo: 'sales' , pathMatch: "full"}
                          ]},
                        {path: 'product/:id', component: ProductDetailComponent, canActivate: [AuthGuard]},
                        {path: 'seller', component: SellerPanelComponent, canActivate: [SellerGuard], children: [
                            {path: 'add-product', component: SellerAddProductComponent },
                            {path: 'seller-orders', component: SellerOrdersComponent }
                          ]}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
