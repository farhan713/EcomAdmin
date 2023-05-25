import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { AdduserComponent } from './adduser.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule } from '@angular/forms';
import { AdduserDailogComponent } from './adduser-dailog/adduser-dailog.component';

export const routes = [
    { path: '', component: AdduserComponent, pathMatch: 'full' }
  ];

@NgModule({
  declarations: [AdduserComponent, AdduserDailogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), 
    SharedModule,
    NgxPaginationModule,
    ReactiveFormsModule
  ]
})
export class AdduserModule { }