


import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { Data, AppService } from '../../app.service';
import { Product } from "../../app.models";
import { Settings, AppSettings } from 'src/app/app.settings';
import { ClickStreamService } from '../services/click-stream.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-products-carousel',
  templateUrl: './products-carousel.component.html',
  styleUrls: ['./products-carousel.component.scss']
})
export class ProductsCarouselComponent implements OnInit {

  @Input('products') products;
  public config: SwiperConfigInterface = {};
  public settings: Settings;
  currentVisibleproducts : any =[];
  constructor(public appSettings:AppSettings,
    private clickService: ClickStreamService,
    private http: HttpClient,
    public appService:AppService, public dialog: MatDialog, private router: Router) { 
    // console.log(this.products);
    this.settings = this.appSettings.settings;
  }

  ngOnInit() { 
  //  console.log(this.products);
   this.products.forEach((element,i) => {
    if(i < 4) {
      this.currentVisibleproducts.push(element.id)
    }
   });
   this.userRecomandationSendFirstFourProd();
 
  
  }
  

  ngAfterViewInit(){
    this.config = {
      observer: true,
      slidesPerView: 1,
      spaceBetween: 16,       
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,        
      loop: false,
      preloadImages: false,
      lazy: true,  
      breakpoints: {
        480: {
          slidesPerView: 1
        },
        740: {
          slidesPerView: 2,
        },
        960: {
          slidesPerView: 3,
        },
        1280: {
          slidesPerView: 4,
        },
        1500: {
          slidesPerView: 5,
        }
      }
    }
    setTimeout(() => {
      // console.log(this.products);
      
    }, 2000);
  }

  public openProductDialog(product){   
    let dialogRef = this.dialog.open(ProductDialogComponent, {
        data: product,
        panelClass: 'product-dialog',
        direction: (this.settings.rtl) ? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(product => {
      if(product){
        this.router.navigate(['/products', product.id, product.name]); 
      }
    });
  }
  userRecomandationSendFirstFourProd(){
    this.userReccomandationActivitySendFirstFourProd();
    let data = {
      status: "Success",
      message: "user created successfully.",
      status_code: 200,
      data_tables: [
          {
              table_name: "tb_user_recommendation",
              data: {
                 org_id: this.clickService.getOrgId(),
                store_id: -1,
                session_id:this.clickService.getSessionId(),
                user_id : this.clickService.getUser(),
                user_recommendation_id : this.products[0].user_recommendation_id,
                recommendation_type_id : this.products[0].recommendation_type_id,
                recommendation_type : this.products[0].recommendation_type,
                returned_sku_id_list : this.currentVisibleproducts
              }
     
          }
        ]
     }
    //  console.log(this.currentVisibleproducts);
     this.http.post<any>('http://127.0.0.1:8000/console/dashboard/user_recommendation', {response:data}).subscribe({
      next: data => {
        // console.log(data);
        
      },
      error: error => {
        // console.log(error);
  
      }
    })
  }

  navigateToProductPage(product) {
    // console.log(this.currentVisibleproducts ,"chelll");
    
    let currentURL = this.router.url;
    let splitURL = currentURL.split("/");
    let currentRoute = splitURL[1];
    let checkQuery = localStorage.getItem(product.id);
    // console.log("hiii")
    let arrayToBesend = [];
    arrayToBesend.push(product.product_id)
      let data = {
        data_tables: [
            {
                table_name: "tb_user_recommendation_activity",
                data: {
                  org_id:this.clickService.getOrgId(),
                  store_id: -1,
                  session_id:this.clickService.getSessionId(),
                  user_id : parseInt(this.clickService.getUser()),
                  user_recommendation_id : product.user_recommendation_id,
                  recommendation_type_id : product.recommendation_type_id,
                  product_viewed : arrayToBesend,
                  product_impression_list : this.currentVisibleproducts
                }
       
            }
          ]
       }
       this.http.post<any>('http://127.0.0.1:8000/console/dashboard/user_recommendation_activity', {response:data}).subscribe({
        next: data => {
        },
        error: error => {
    
        }
      })
    // console.log(checkQuery);
    let pageName;
    if(product.pageName) {
      pageName = product.pageName
    } else {
      pageName = "";
    }
    if (currentRoute == 'products') {
      // console.log("in iff");
      
      this.clickService.updateProductTrack("product",product.id);
      this.clickService.updateProductTrack("user_recommendation_id",product.user_recommendation_id);
      this.clickService.updateProductTrack("pageName",pageName);
      this.clickService.updateProductTrack("recommendation_type_id",product.recommendation_type_id);
      this.clickService.updateProductTrack("from",product.clickValue);
      this.clickService.updateProductTrack("lastscreen","home");
      this.clickService.updateProductTrack("currentScreen","products");
      this.clickService.updateProductTrack("sku_ids",this.currentVisibleproducts);
      this.clickService.updateProductTrack("query",product.query);
      this.currentVisibleproducts = [];
      this.clickService.AClicked(product.id)
    } else {
      // console.log("in else");
      this.clickService.updateProductTrack("product",product.id);
      this.clickService.updateProductTrack("pageName",pageName);
      this.clickService.updateProductTrack("user_recommendation_id",product.user_recommendation_id);
      this.clickService.updateProductTrack("recommendation_type_id",product.recommendation_type_id);
      this.clickService.updateProductTrack("from",product.clickValue);
      this.clickService.updateProductTrack("lastscreen","home");
      this.clickService.updateProductTrack("currentScreen","products");
      this.clickService.updateProductTrack("sku_ids",this.currentVisibleproducts);
      this.clickService.updateProductTrack("query",product.query);

      this.currentVisibleproducts = [];
      this.router.navigate(['/products', "2", product.id]);
    }
  }
  userRecomandationSendSinglePrdOnNextClick() {
    this.userReccomandationActivitySendSingleProdonNextClick();
    this.clickService.userVisit(this.clickService.getSessionId(),0,"false","true");
    let arrayToBesend = [];
    arrayToBesend.push(this.products[this.currentVisibleproducts.length].id)
    this.currentVisibleproducts.push(
      this.products[this.currentVisibleproducts.length].id)

      let data = {
        status: "Success",
        message: "user created successfully.",
        status_code: 200,
        data_tables: [
            {
                table_name: "tb_user_recommendation",
                data: {
                org_id: this.clickService.getOrgId(),
                store_id: -1,
                  session_id:this.clickService.getSessionId(),
                  user_id : this.clickService.getUser(),
                  user_recommendation_id : this.products[0].user_recommendation_id,
                  recommendation_type_id : this.products[0].recommendation_type_id,
                  recommendation_type : this.products[0].recommendation_type,
                  returned_sku_id_list : arrayToBesend
                }
       
            }
          ]
       }
       this.http.post<any>('http://127.0.0.1:8000/console/dashboard/user_recommendation', {response:data}).subscribe({
        next: data => {
          // console.log(data);
          
        },
        error: error => {
          // console.log(error);
    
        }
      })
    // console.log(this.currentVisibleproducts);
    this.clickService.sendMessage({ "event": "click", "eventType": "SLIDER_NEXT_CLICK", "type":this.products[0].clickValue });
  }
  userReccomandationActivitySendSingleProdonNextClick() {
    console.log("hiii")
    let arrayToBesend = [];
    if(this.products.length) {
 arrayToBesend.push(this.products[this.currentVisibleproducts.length].id)
    }
   
    this.currentVisibleproducts.push(this.products[this.currentVisibleproducts.length].id)
      let data = {
        data_tables: [
            {
                table_name: "tb_user_recommendation_activity",
                data: {
                   org_id: this.clickService.getOrgId(),
                  store_id: -1,
                  session_id:this.clickService.getSessionId(),
                  user_id :parseInt(this.clickService.getUser()),
                  user_recommendation_id : this.products[0].user_recommendation_id,
                  recommendation_type_id : this.products[0].recommendation_type_id,
                  product_viewed : [],
                  product_impression_list : arrayToBesend
                }
       
            }
          ]
       }
       this.http.post<any>('http://127.0.0.1:8000/console/dashboard/user_recommendation_activity', {response:data}).subscribe({
        next: data => {
        },
        error: error => {
    
        }
      })
   
  }
  userReccomandationActivitySendFirstFourProd() {
    // console.log("hiii")
    let arrayToBesend = [];
    arrayToBesend.push(this.products[this.currentVisibleproducts.length].id)
    this.currentVisibleproducts.push(this.products[this.currentVisibleproducts.length].id)
    // console.log(this.currentVisibleproducts ,"main")
    // console.log(arrayToBesend ,"local")

    let data = {
      data_tables: [
          {
              table_name: "tb_user_recommendation_activity",
              data: {
                org_id: this.clickService.getOrgId(),
                store_id: -1,
                session_id:this.clickService.getSessionId(),
                user_id :parseInt(this.clickService.getUser()),
                user_recommendation_id : this.products[0].user_recommendation_id,
                recommendation_type_id : this.products[0].recommendation_type_id,
                product_viewed : [],
                product_impression_list : this.currentVisibleproducts
              }
     
          }
        ]
     }
       this.http.post<any>('http://127.0.0.1:8000/console/dashboard/user_recommendation_activity', {response:data}).subscribe({
        next: data => {
        },
        error: error => {
    
        }
      })
   
  }

}

