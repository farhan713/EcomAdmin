import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { RefundComponent } from './refund.component';
import { FormsModule } from '@angular/forms';
export const routes = [
  { path: '', component: RefundComponent, pathMatch: 'full' }
]; 

@NgModule({
  declarations: [
    RefundComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), 
    SharedModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class RefundModule { }
