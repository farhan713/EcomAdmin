import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core'; 
import { refunds } from '../analytics/analytics.data';
// import { sales_summary } from '../analytics/analytics.data';
import { montly_sales } from '../analytics/analytics.data';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { ClickStreamService } from 'src/app/shared/services/click-stream.service';
import { AuthService } from 'src/app/shared/services/auth.service';

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
  constructor(private http: HttpClient ,
    private auth: AuthService,
    private clickService : ClickStreamService) { 
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

    this.auth.sendHttpGet('http://127.0.0.1:8000/console/'+this.clickService.getAdminOrgId()+'/dashboard/search_impact_summary/' +  days)
    .then((respData) => {
      if(respData) {
        if(respData.datalist.revenue_on_days) {
          respData.datalist.revenue_on_days.forEach(element => {

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
        
        let vistPercentage = (respData.datalist.visit_with_search / (respData.datalist.visit_without_search + respData.datalist.visit_with_search)) * 100;
        console.log(vistPercentage);
        
        let orderPercentage = (respData.datalist.orders_with_search / (respData.datalist.orders_without_search + respData.datalist.orders_with_search)) * 100;
        console.log(orderPercentage);
        
        let revenuePercentage = (respData.datalist.revenue_with_search / (respData.datalist.revenue_without_search + respData.datalist.revenue_with_search)) * 100;
        console.log(revenuePercentage);
        
        (respData.datalist.avg_order_value_with_search / respData.datalist.avg_order_value_without_search)
        let orderImpact;
        
        if (respData.datalist.avg_order_value_without_search == 0){
          orderImpact = 0
        }else {orderImpact = (respData.datalist.avg_order_value_with_search.toFixed(2) / respData.datalist.avg_order_value_without_search.toFixed(2)).toFixed(1)}
        

        (respData.datalist.revenue_per_visit_with_search.toFixed(2) / respData.datalist.revenue_per_visit_without_search.toFixed(2))
        let revImpact;
        if (respData.datalist.revenue_per_visit_without_search == 0){
          revImpact = 0
        }else {revImpact = (respData.datalist.revenue_per_visit_with_search.toFixed(2) / respData.datalist.revenue_per_visit_without_search.toFixed(2)).toFixed(1)}


        (respData.datalist.conversion_rate_with_search.toFixed(2) / respData.datalist.conversion_rate_with_search.toFixed(2))
        let conversionImpact;
        if (respData.datalist.conversion_rate_without_search == 0){
          conversionImpact = 0
        }else {conversionImpact = (respData.datalist.conversion_rate_with_search.toFixed(2) / respData.datalist.conversion_rate_without_search.toFixed(2)).toFixed(1)}
        console.log(revenuePercentage);


        this.Visit = [
          {
            "name": "Visit",
            "value": vistPercentage,
            "withSearch": respData.datalist.visit_with_search,
            "withoutSearch": respData.datalist.visit_without_search,
            "withSearchAverage":respData.datalist.avg_order_value_with_search.toFixed(2),
            "withoutAverage": respData.datalist.avg_order_value_without_search.toFixed(2),
            "orderImpact": orderImpact
          }
        ];
        this.orders = [
          {
            "name": "Orders",
            "value": orderPercentage,
            "withSearch": respData.datalist.orders_with_search,
            "withoutSearch": respData.datalist.orders_without_search,
            "withSearchAverage": respData.datalist.revenue_per_visit_with_search.toFixed(2),
            "withoutAverage": respData.datalist.revenue_per_visit_without_search.toFixed(2),
            "revImpact": revImpact
          }
        ];
        this.revenue = [
          {
            "name": "Revenue",
            "value": revenuePercentage,
            "withSearch": respData.datalist.revenue_with_search,
            "withoutSearch":respData.datalist.revenue_without_search,
            "withSearchAverage": respData.datalist.conversion_rate_with_search.toFixed(2),
            "withoutAverage": respData.datalist.conversion_rate_without_search.toFixed(2),
            "conversionImpact": conversionImpact
          }
        ];
      }
    }).catch((error) => { console.log(error) });

    this.sales_summary = [];

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
