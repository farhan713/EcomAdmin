import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { WithdrawalComponent } from './withdrawal.component';
import { SortingDialogComponent } from './sorting-dialog/sorting-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';

export const routes = [
  { path: '', component: WithdrawalComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    WithdrawalComponent,
    SortingDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), 
    SharedModule,
    NgxPaginationModule,
    ReactiveFormsModule
  ]
})
export class WithdrawalModule { }
