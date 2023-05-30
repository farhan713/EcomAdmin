import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core'; 
import { refunds } from '../analytics/analytics.data';
// import { sales_summary } from '../analytics/analytics.data';
import { montly_sales } from '../analytics/analytics.data';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { ClickStreamService } from 'src/app/shared/services/click-stream.service';

interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit { 
  
  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];
  days = [
    1,7,15,30
  ]
  public refunds: any[]; 
  public showLegend = false;
  public gradient = true;
  view: any[] = [278, 300];
  views: any[] = [700, 400];
  single = [
    {
      "name": "Germany",
      "value": 75
    }
  ];
  public colorScheme = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#F47B00', '#606060']
  }; 
  colorScheme1 = {
    domain: ['#C7B42C']
  };
  colorScheme2 = {
    domain: ['#5AA454']
  };
  colorScheme3 = {
    domain: ['#A10A28']
  };

  transactions = [
  
  ];
  public showLabels = false;
  public explodeSlices = false;
  public doughnut = false; 
 revenue: any= [];
 Visit: any =[];
 orders: any =[]; 
  public sales_summary: any[];
  public showXAxis = true;
  public showYAxis = true;
  public gradients = false;
  public showLegends = false;
  public showXAxisLabel = true;
  public xAxisLabel = 'Date';
  public showYAxisLabel = true;
  public yAxisLabel = 'Sales';
  public yAxisLabel1 = 'Count';
  public xAxisLabel1 = 'Query';
  public colorSchemes = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#F47B00', '#606060']
  };  
  public data: any[]; 
  public showLegendss = false;
  public gradientss = true;
  public colorSchemess = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B']
  }; 

  popular :any = {};
  topGrossing :any = {};
  topConverting :any = {};

  selectedValue = 30

  public showLabelsss = true;
  public explodeSlicesss = false;
  public doughnutss = false; 
  @ViewChild('resizedDiv') resizedDiv:ElementRef;
  public previousWidthOfResizedDiv:number = 0; 
  popular_searches = [
    
  ];
  Top_grossing_searches = [
   
  ];
  constructor(private http: HttpClient ,private clickService : ClickStreamService) { 
    Object.assign(this, {refunds}); 
    // Object.assign(this, {sales_summary}); 
  }
 
  
  public onSelect(event) {
    console.log(event);
  }
  ngOnInit(): void {
    this.data = montly_sales;  
    this.getData(this.selectedValue);

  }

  dateChanged($event) {
    console.log($event.target.value);
  }

  getData(days) {
    this.sales_summary = [];
    this.http.get<any>('http://127.0.0.1:8000/console/'+this.clickService.getAdminOrgId()+'/dashboard/search_impact_summary/' +  days).subscribe({
      next: data => {
        console.log(data);
        if(data.dataset.revenue_on_days) {
          data.dataset.revenue_on_days.forEach(element => {

            const date = moment(element.date);
            console.log(date.format('DD-MM-YYYY'));
  
            this.sales_summary.push(
              {name:date.format('DD-MM-YYYY'),
              value:element.revenue
            }
            )
          });
        }
    
        console.log( this.sales_summary);
        
        let vistPercentage = (data.dataset.visit_with_search / (data.dataset.visit_without_search + data.dataset.visit_with_search)) * 100;
        console.log(vistPercentage);
        
        let orderPercentage = (data.dataset.orders_with_search / (data.dataset.orders_without_search + data.dataset.orders_with_search)) * 100;
        console.log(orderPercentage);
        
        let revenuePercentage = (data.dataset.revenue_with_search / (data.dataset.revenue_without_search + data.dataset.revenue_with_search)) * 100;
        console.log(revenuePercentage);
        
        (data.dataset.avg_order_value_with_search / data.dataset.avg_order_value_without_search)
        let orderImpact;
        
        if (data.dataset.avg_order_value_without_search == 0){
          orderImpact = 0
        }else {orderImpact = (data.dataset.avg_order_value_with_search.toFixed(2) / data.dataset.avg_order_value_without_search.toFixed(2)).toFixed(1)}
        

        (data.dataset.revenue_per_visit_with_search.toFixed(2) / data.dataset.revenue_per_visit_without_search.toFixed(2))
        let revImpact;
        if (data.dataset.revenue_per_visit_without_search == 0){
          revImpact = 0
        }else {revImpact = (data.dataset.revenue_per_visit_with_search.toFixed(2) / data.dataset.revenue_per_visit_without_search.toFixed(2)).toFixed(1)}


        (data.dataset.conversion_rate_with_search.toFixed(2) / data.dataset.conversion_rate_with_search.toFixed(2))
        let conversionImpact;
        if (data.dataset.conversion_rate_without_search == 0){
          conversionImpact = 0
        }else {conversionImpact = (data.dataset.conversion_rate_with_search.toFixed(2) / data.dataset.conversion_rate_without_search.toFixed(2)).toFixed(1)}
        console.log(revenuePercentage);


        this.Visit = [
          {
            "name": "Visit",
            "value": vistPercentage,
            "withSearch": data.dataset.visit_with_search,
            "withoutSearch": data.dataset.visit_without_search,
            "withSearchAverage":data.dataset.avg_order_value_with_search.toFixed(2),
            "withoutAverage": data.dataset.avg_order_value_without_search.toFixed(2),
            "orderImpact": orderImpact
          }
        ];
        this.orders = [
          {
            "name": "Orders",
            "value": orderPercentage,
            "withSearch": data.dataset.orders_with_search,
            "withoutSearch": data.dataset.orders_without_search,
            "withSearchAverage": data.dataset.revenue_per_visit_with_search.toFixed(2),
            "withoutAverage": data.dataset.revenue_per_visit_without_search.toFixed(2),
            "revImpact": revImpact
          }
        ];
        this.revenue = [
          {
            "name": "Revenue",
            "value": revenuePercentage,
            "withSearch": data.dataset.revenue_with_search,
            "withoutSearch":data.dataset.revenue_without_search,
            "withSearchAverage": data.dataset.conversion_rate_with_search.toFixed(2),
            "withoutAverage": data.dataset.conversion_rate_without_search.toFixed(2),
            "conversionImpact": conversionImpact
          }
        ];
      },
      error: error => {
        console.log(error);

      }
    })

    this.transactions = [];
    this.Top_grossing_searches = [];
    this.popular_searches = []
    this.http.get<any>('http://127.0.0.1:8000/console/'+this.clickService.getAdminOrgId()+'/dashboard/search_insights/' +  days).subscribe({
      next: data => {
        console.log(data);
        if(data.dataset.top_converting_searches != null) {
          data.dataset.top_converting_searches.forEach(element => {
            this.transactions.push({
              name: element.query,
              value: element.value.toFixed(2)
            })
          });
        }
        if(data.dataset.top_grossing_searches != null) {
          data.dataset.top_grossing_searches.forEach(element => {
            this.Top_grossing_searches.push({
              name: element.query,
              value: element.value.toFixed(2)
            })
          });
        }
        if(data.dataset.top_popular_searches != null) {
          data.dataset.top_popular_searches.forEach(element => {
            this.popular_searches.push({
              name: element.query,
              value: element.value.toFixed(2)
            })
          });
        }
      },
      error: error => {
        console.log(error);

      }
    })
  }

}
