import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SupportComponent } from './support.component';
import { FormsModule } from '@angular/forms';
export const routes = [
  { path: '', component: SupportComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    SupportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), 
    SharedModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class SupportModule { }
