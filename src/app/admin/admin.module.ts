import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { InputFileConfig, InputFileModule } from 'ngx-input-file';
const config: InputFileConfig = {
  fileAccept: '*'
};

import { AdminComponent } from './admin.component';
import { MenuComponent } from './components/menu/menu.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { FullScreenComponent } from './components/fullscreen/fullscreen.component'; 
import { MessagesComponent } from './components/messages/messages.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component'; 
import { DragDropModule } from '@angular/cdk/drag-drop';
import { StyleSettingsComponent } from './style-settings/style-settings.component';
import { ReactiveFormsModule  ,FormsModule} from '@angular/forms';
// import { AdduserComponent } from './adduser/adduser.component';

export const routes = [ 
  { 
    path: '', 
    component: AdminComponent, children: [
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) }, 
      { path: 'profile', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule) },
      { path: 'sales', loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule) },
      { path: 'sse-settings', loadChildren: () => import('./users/users.module').then(m => m.UsersModule), data: { breadcrumb: 'Users' } },
      { path: 'groupped', loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule), data: { breadcrumb: 'Customers' } },
      { path: 'one-way', loadChildren: () => import('./coupons/coupons.module').then(m => m.CouponsModule), data: { breadcrumb: 'Coupons' } },
      { path: 'sorting', loadChildren: () => import('./withdrawal/withdrawal.module').then(m => m.WithdrawalModule), data: { breadcrumb: 'Withdrawal' } },
      { path: '', loadChildren: () => import('./analytics/analytics.module').then(m => m.AnalyticsModule), data: { breadcrumb: 'Analytics' } },
      { path: 'rec-results', loadChildren: () => import('./refund/refund.module').then(m => m.RefundModule), data: { breadcrumb: 'Refund' } },
      { path: 'rec-dashboard', loadChildren: () => import('./followers/followers.module').then(m => m.FollowersModule), data: { breadcrumb: 'Followers' } },
      { path: 'keywords', loadChildren: () => import('./support/support.module').then(m => m.SupportModule), data: { breadcrumb: 'Support' } },
      { path: 'top-searches', loadChildren: () => import('./reviews/reviews.module').then(m => m.ReviewsModule), data: { breadcrumb: 'Reviews' } },
      { path: 'add-user', loadChildren: () => import('./adduser/adduser.module').then(m => m.AdduserModule), data: { breadcrumb: 'Adduser' } }  ,
      {path : 'styles' , component : StyleSettingsComponent}
  
    ]
  } 
];

@NgModule({
  declarations: [
    AdminComponent,
    MenuComponent,
    UserMenuComponent,
    FullScreenComponent,
    MessagesComponent,
    BreadcrumbComponent,
    StyleSettingsComponent,
   //AdduserComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    DragDropModule,
    InputFileModule.forRoot(config),
    NgCircleProgressModule.forRoot(),
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AdminModule { }
