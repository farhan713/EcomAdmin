import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { SharedModule } from '../../shared/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AnalyticsComponent } from './analytics.component';
import { MontlySalesComponent } from './montly-sales/montly-sales.component';
import { SalesSummaryComponent } from './sales-summary/sales-summary.component';
import { DailyViewsStatsComponent } from './daily-views-stats/daily-views-stats.component';
import { MostViewedProductsComponent } from './most-viewed-products/most-viewed-products.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { RefundsComponent } from './refunds/refunds.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

export const routes = [
  { path: '', component: AnalyticsComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AnalyticsComponent,
    MontlySalesComponent,
    SalesSummaryComponent,
    DailyViewsStatsComponent,
    MostViewedProductsComponent,
    TransactionsComponent,
    RefundsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), 
    SharedModule,
    NgxChartsModule,
    FormsModule,
    ReactiveFormsModule,
    NgCircleProgressModule.forRoot({
      "backgroundColor": "#2f3e9e",
      "radius": 60,
      "maxPercent": 200,
      "units": "%",
      "unitsColor": "#FFFFFF",
      "outerStrokeWidth": 5,
      "outerStrokeColor": "#FFFFFF",
      "innerStrokeColor": "#FFFFFF",
      "titleColor": "#FFFFFF",
      "titleFontSize": "35",
      "subtitleColor": "#FFFFFF",
      "subtitleFontSize": "35",
      "unitsFontSize": "25",
      "showSubtitle": false,
      "showInnerStroke": false,
      "startFromZero": false})
  ],
  
})
export class AnalyticsModule { }
