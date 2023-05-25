import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { ClickStreamService } from 'src/app/shared/services/click-stream.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  recommendMoreProducts: any =[]; 
  exploreMoreProducts: any =[];
  orderPlaceSettingList: any =[];

  constructor(public router:Router ,public appService: AppService ,private http: HttpClient , private clickService: ClickStreamService) { }

  ngOnInit() {
  
    // this.appService.Data.cartList.forEach(product => {
    //   console.log(product.id ,"check");
    //   // this.clickService.sendMessage({ "event": "keyup", "eventType": "PURCHASED" ,"productId":product.id});
    //   let myPro = localStorage.getItem(product.id.toString());
    //   console.log(myPro ,"aaksh");
      
    //   // if (myPro) {
    //   //   let parsePro = JSON.parse(myPro);
    //   //   parsePro["quantity"] = product.cartCount;
    //   //   parsePro["price"] = product.newPrice;
    //   //   clickProductList.push(parsePro);

    //   // }

    // })
    this.getSettings();
  }

  public goHome(): void { 
    if(this.router.routerState.snapshot.url.includes("/admin")){
      this.router.navigate(['/admin']);
    }
    else{
      this.router.navigate(['/']);
    } 
  }


  public exploreMoreItem() {
    this.http.get<any>('http://127.0.0.1:8000/rec/'+this.clickService.getOrgId()+'/explore_more_items/' + this.clickService.getUser() + '/' + '1' + '/' + '100').subscribe({
      next: data => {
        // console.log(data)
        let demo;
        demo = data.dataset.products;
        if(demo){
        demo.forEach((val) => {
          val['id'] = val.product_id;
          val['color'] = [
            "#5C6BC0",
            "#66BB6A",
            "#90A4AE"
          ]
          val['availibilityCount'] = 5;
          val['cartCount'] = 0;
          val['description'] = val.Romantic_Copy_Short;
          val['discount'] = null;
          val['name'] = val.product;
          val['newPrice'] = val.price;
          val['oldPrice'] = null;
          val['ratingsCount'] = 3;
          val['ratingsValue'] = 4;
          val['size'] = val.size;
          val['weight'] = null;
          val['brand'] = val.brand;
          val['storeid'] = val.store_id;
          val['sub_type'] = val.subtype;
          val['thumbnailurl'] = val.image_url;
          val['clickValue'] = "Home + expolre_more_items";
          val['dept'] = val.dept;
          val['user_recommendation_id'] = 4;
          val['recommendation_type_id'] = 4;
          val['pageName'] = 'Home Page';
          val['recommendation_type'] = 'explore_more_items_based_on_purchased_history';
          val['query'] = "";
            val['images'] = [{
              "big": "https://www.mastgeneralstore.com/" + val.image_url,
              "small": "https://www.mastgeneralstore.com/" + val.image_url,
              "medium": "https://www.mastgeneralstore.com/" + val.image_url

            }]
        })
        this.exploreMoreProducts = demo;
      }
      },
      error: error => {
        console.log(error);

      }
    })

  }

  public recommendMoreItem() {
    this.http.get<any>('http://127.0.0.1:8000/rec/'+this.clickService.getOrgId()+'/recommend_more_products/' + this.clickService.getUser() + '/' + '1' + '/' + '100').subscribe({
      next: data => {
        let demo;
        demo = data.dataset.products;
        if(demo){
        demo.forEach((val) => {
          val['id'] = val.product_id;
          val['color'] = [
            "#5C6BC0",
            "#66BB6A",
            "#90A4AE"
          ]
          val['availibilityCount'] = 5;
          val['cartCount'] = 0;
          val['description'] = val.Romantic_Copy_Short;
          val['discount'] = null;
          val['name'] = val.product;
          val['newPrice'] = val.price;
          val['oldPrice'] = null;
          val['ratingsCount'] = 3;
          val['ratingsValue'] = 4;
          val['size'] = val.size;
          val['weight'] = null;
          val['brand'] = val.brand;
          val['storeid'] = val.store_id;
          val['sub_type'] = val.subtype;
          val['thumbnailurl'] = val.image_url;
          val['clickValue'] = "Home + recommend_more_products";
          val['dept'] = val.dept,
          val['user_recommendation_id'] = 5;
          val['recommendation_type_id'] = 5;
          val['pageName'] = 'Home Page';
          val['recommendation_type'] = 'recommend_more_products';
          val['query'] = "",
            val['images'] = [{
              "big": "https://www.mastgeneralstore.com/" + val.image_url,
              "small": "https://www.mastgeneralstore.com/" + val.image_url,
              "medium": "https://www.mastgeneralstore.com/" + val.image_url

            }]
        })
        this.recommendMoreProducts = demo;
      }
      },
      error: error => {
        console.log(error);

      }
    })

  }
  getSettings() {
    this.http
      .get<any>(
        "http://127.0.0.1:8000/console/"+this.clickService.getOrgId()+"/dashboard/pagename_details/"
      )
      .subscribe({
        next: (data) => {
          let tempData:any= [] = data.dataset;
          this.orderPlaceSettingList = [];
          tempData.forEach((page) => {
            for (const recommendation of Object.values(page)) {
              (recommendation as Array<any>).forEach((rec) => {
                if(rec.recommendation_type_page_placement_id == 5){
                  this.orderPlaceSettingList.push(rec);
                }
              });
            }
          });
        setTimeout(()=>{
          if(this.orderPlaceSettingList.length) {
            this.orderPlaceSettingList.forEach(element => {
              if(element.recommendation_type == "Explore More Items") {
                if(element.status == 'true') {
                  this.exploreMoreItem();
                }
              }
              if(element.recommendation_type == "Recommended for you") {
                if(element.status == 'true') {
                  this.recommendMoreItem();
                }
              }
              if(element.recommendation_type == "Check Out Similar Item") {
                if(element.status == 'true') {
                  // this.getRelatedProducts(this.prodId);
                }
              }
              if(element.recommendation_type == "Discover more options") {
                if(element.status == 'true') {
                  // this.getRelatedProductsKnn(this.prodId);
                }
              }
              if(element.recommendation_type == "Customers also viewed") {
                if(element.status == 'true') {
                  // this.getAlsoBuyProducts(this.prodId);
                }
              }
              if(element.recommendation_type == "Check Out Similar Item") {
                if(element.status == 'true') {
                  // add api for similar
                  // this.getAlsoBuyProducts(id, prodData[0].product);
                }
              }
            });
          } else {
            this.exploreMoreItem();
            this.recommendMoreItem();
            // this.getRelatedProducts(this.prodId);
            // this.getRelatedProductsKnn(this.prodId);
            // this.getAlsoBuyProducts(this.prodId);
          }
        },200)
        },
      });
  }

 
}
