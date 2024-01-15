
import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { refunds } from "../analytics/analytics.data";
import { sales_summary } from "../analytics/analytics.data";
import { montly_sales } from "../analytics/analytics.data";
import { HttpClient } from "@angular/common/http";
import { customers } from "../dashboard/dashboard.data";
import * as moment from "moment";
import { ClickStreamService } from "src/app/shared/services/click-stream.service";
import { AuthService } from "src/app/shared/services/auth.service";

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-followers",
  templateUrl: "./followers.component.html",
  styleUrls: ["./followers.component.scss"],
})
export class FollowersComponent implements OnInit {
  public customers: any[];
  foods: Food[] = [
    { value: "steak-0", viewValue: "Steak" },
    { value: "pizza-1", viewValue: "Pizza" },
    { value: "tacos-2", viewValue: "Tacos" },
  ];
  days = [1, 7, 15, 30];
  public refunds: any[];
  public showLegend = false;
  public gradient = true;
  view: any[] = [278, 300];
  views: any[] = [700, 400];
  single = [
    {
      name: "Germany",
      value: 75,
    },
  ];
  public colorScheme = {
    domain: ["#2F3E9E", "#D22E2E", "#378D3B", "#0096A6", "#F47B00", "#606060"],
  };
  colorScheme1 = {
    domain: ["#C7B42C"],
  };
  colorScheme2 = {
    domain: ["#5AA454"],
  };
  colorScheme3 = {
    domain: ["#A10A28"],
  };

  transactions = [
    {
      name: "Store 1",
      value: 40632,
    },
    {
      name: "Store 2",
      value: 49737,
    },
    {
      name: "Store 3",
      value: 36745,
    },
    {
      name: "Store 4",
      value: 36240,
    },
    {
      name: "Store 5",
      value: 33000,
    },
    {
      name: "Store 6",
      value: 35800,
    },
  ];
  public showLabels = true;
  public explodeSlices = false;
  public doughnut = false;
  revenue: any = [];
  Visit: any = [];
  orders: any = [];
  public sales_summary: any[];
  public showXAxis = true;
  public showYAxis = true;
  public gradients = false;
  public showLegends = false;
  public showXAxisLabel = true;
  public xAxisLabel = "Date";
  public showYAxisLabel = true;
  public yAxisLabel = "Views";
  public yAxisLabel1 = "Count";
  public xAxisLabel1 = "Query";
  public colorSchemes = {
    domain: ["#2F3E9E", "#D22E2E", "#378D3B", "#0096A6", "#F47B00", "#606060"],
  };
  public data: any[];
  public showLegendss = false;
  public gradientss = true;
  public colorSchemess = {
    domain: ["#2F3E9E", "#D22E2E", "#378D3B"],
  };

  popular: any = {};
  topGrossing: any = {};
  topConverting: any = {};
  public autoScale = true;
  public showLabelsss = true;
  public explodeSlicesss = false;
  public doughnutss = false;
  @ViewChild("resizedDiv") resizedDiv: ElementRef;
  public previousWidthOfResizedDiv: number = 0;
  popular_searches = [];
  Top_grossing_searches = [];

  proFiles: any = [];
  selectedDay = 30;
  selectedProfile = "all";
  recPer = 0;
  clickedPer = 0;
  purchasedPer = 0;

  recPerTitle = "";
  clickedPerTitle = "";
  purchasedPerTitle = "";

  serverRes: any;
  serverResInteractions: any;

  viewes_summery: any = [];
  constructor(private http: HttpClient, private clickService: ClickStreamService, private auth: AuthService,) {
    Object.assign(this, { refunds });
    Object.assign(this, { sales_summary });
  }

  public onSelect(event) {
    console.log(event);
  }
  ngOnInit(): void {
    this.customers = customers;
    // this.customers = this.addRandomValue('customers');
    this.data = montly_sales;
    this.geProfileList();
    this.getData();
  }

  geProfileList() {
    this.auth.sendHttpGet('http://127.0.0.1:8000/console/dashboard/recommendation_type')
      .then((respData) => {
        this.proFiles = respData.datalist;
      }).catch((error) => { console.log(error) });
  }

  dateChanged($event) {
    console.log($event.target.value);
  }

  getData() {
    this.viewes_summery = [];
    this.auth.sendHttpGet("http://127.0.0.1:8000/console/" + this.clickService.getAdminOrgId() + "/dashboard/get_recommendation_activity_profile/" +
      this.selectedProfile +
      "/" +
      this.selectedDay)
      .then((respData) => {
        this.serverRes = respData.datalist;
        this.serverResInteractions = respData.datalist.Number_of_Interactions;
        this.recPer = this.serverRes.Recommendations.total;
        if (this.serverRes.Recommendations.total === 0) {
          this.clickedPer = 0
        }
        else {
          this.clickedPer = (this.serverRes.Estimated_product_viewed.total / this.serverRes.Recommendations.total) * 100;
        }
        if (this.serverResInteractions.Purchased_items === 0) {
          this.purchasedPer = 0
        }
        else {
          this.purchasedPer = (this.serverRes.Estimated_purchase_count.total / this.serverResInteractions.Purchased_items) * 100;
        }


        this.recPerTitle = this.recPer + " " + "views";
        this.clickedPerTitle = this.clickedPer.toFixed(2) + "%";
        this.purchasedPerTitle = this.purchasedPer.toFixed(2) + "%";
        if (respData.datalist.Views_on_days != null) {
          respData.datalist.Views_on_days.forEach((element) => {
            const date = moment(element.Date);
            console.log(date.format("DD-MM-YYYY"));

            this.viewes_summery.push({
              name: date.format("DD-MM-YYYY"),
              value: element.Views,
            });
          });
        }
      }).catch((error) => { console.log(error) });

  }
}

