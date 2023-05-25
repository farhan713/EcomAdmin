import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReviewsComponent } from './reviews.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

export const routes = [
  { path: '', component: ReviewsComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    ReviewsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), 
    SharedModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ReviewsModule { }
