import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrdersComponent } from './orders/orders.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { CreateOrgnizationComponent } from './create-orgnization/create-orgnization.component';
import { CreateStoreComponent } from './create-store/create-store.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
export const routes = [ 
  { path: '', redirectTo: 'orders', pathMatch: 'full'},
  { path: 'orders', component: OrdersComponent, data: { breadcrumb: 'Orders' } },
  { path: 'transactions', component: TransactionsComponent, data: { breadcrumb: 'Transactions' } } 
];

@NgModule({
  declarations: [
    OrdersComponent, 
    TransactionsComponent, CreateOrgnizationComponent, CreateStoreComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), 
    SharedModule,
    NgxPaginationModule,
    FormsModule,ReactiveFormsModule
  ]
})
export class SalesModule { }
