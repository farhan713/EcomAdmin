import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { Data, AppService } from '../../../app.service';
import { Product } from "../../../app.models";
import { emailValidator } from '../../../theme/utils/app-validators';
import { ProductZoomComponent } from './product-zoom/product-zoom.component';
import { HttpClient } from "@angular/common/http";
import {ClickStreamService } from "../../../shared/services/click-stream.service"
import { MatSnackBar } from '@angular/material/snack-bar';
import { TimeAndVisitsTrackerService } from 'src/app/shared/services/time-and-visits-tracker.service';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @ViewChild('zoomViewer', { static: true }) zoomViewer;
  @ViewChild(SwiperDirective, { static: true }) directiveRef: SwiperDirective;
  public config: SwiperConfigInterface = {};
  public config1: SwiperConfigInterface = {};
  public product: Product;
  public image: any;
  public zoomImage: any;
  private sub: any;
  public form: FormGroup;
  public relatedProducts: Array<Product>;
  newRelatedProducts: any = [];
  newRelatedProductsKnn:any = [];
  alsoBuyProducts:any = [];
  exploreMoreProducts:any = [];
  // isAddtocartPressed: boolean = false;
  algorythRealtedProduct: any = [];
  public count:number = 1;
  productsSettingList:any = [];
  youMay:any = [];
  images: any = [
    {
      "small": "https://via.placeholder.com/180x135/4DB6AC/fff/?text=Related Product 1",
      "medium": "https://via.placeholder.com/480x365/4DB6AC/fff/?text=Related Product 1",
      "big": "https://via.placeholder.com/960x720/4DB6AC/fff/?text=Related Product 1"
    },
    {
      "small": "https://via.placeholder.com/180x135/4DB6AC/fff/?text=Related Product 1",
      "medium": "https://via.placeholder.com/480x365/4DB6AC/fff/?text=Related Product 1",
      "big": "https://via.placeholder.com/960x720/4DB6AC/fff/?text=Related Product 1"
    },
    {
      "small": "https://via.placeholder.com/180x135/4DB6AC/fff/?text=Related Product 1",
      "medium": "https://via.placeholder.com/480x365/4DB6AC/fff/?text=Related Product 1",
      "big": "https://via.placeholder.com/960x720/4DB6AC/fff/?text=Related Product 1"
    }
  ]
  desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut congue eleifend nulla vel rutrum. Donec tempus metus non erat vehicula, vel hendrerit sem interdum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae."
  selectedProductData;
  selectedProduct: any;
  pageNumber = 1;
  currentProductSearchValue;
  private dataSubscription: Subscription;
  elapsedTime: number;
  pageVisits: Map<string, number>;
  recommendMoreProducts: any = [];
  totalPrice: any;
  frequentlyBoughtArray: any =[];
  constructor(public appService: AppService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute, 
    public snackBar: MatSnackBar,public dialog: MatDialog, public formBuilder: FormBuilder,
    private clickService : ClickStreamService,
    private timeAndVisitTracker : TimeAndVisitsTrackerService , private spinner: NgxSpinnerService
    
    ) { }

  ngOnInit() {
    this.getSettings();
    setTimeout(() => {
      this.getMyproduct(this.selectedProduct);
    }, 1000);
    // this.timeAndVisitTracker.startTracking();
    
    this.timeAndVisitTracker.startTracking();
    // let seconds;
    // let isSendMsg = true;
    // this.dataSubscription = this.timeAndVisitTracker.getData().subscribe(data => {
    //   this.elapsedTime = data.elapsedTime;
    //   this.pageVisits = data.pageVisits;
    //   seconds = this.elapsedTime / 10000;
    //     if(seconds >= 4 && isSendMsg){
    //       isSendMsg = false;
    //       this.clickService.sendMessage({ "event": "clicked", "eventType": "GENRE_VIEW" ,"productId" : this.selectedProductData.id });
    //     }
    // });
  
   
    this.clickService.aClickedEvent
    .subscribe((id:string) => {
  
      this.selectedProduct = id
      this.getMyproduct(id);
    });
 
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.selectedProduct = params.name;
    });

   
    // this.getRelatedProducts(this.selectedProduct)
    this.form = this.formBuilder.group({
      'review': [null, Validators.required],
      'name': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': [null, Validators.compose([Validators.required, emailValidator])]
    });

    
  }
  getSettings() {
    this.http
      .get<any>(
        "http://127.0.0.1:8000/console/"+this.clickService.getOrgId()+"/dashboard/pagename_details/"
      )
      .subscribe({
        next: (data) => {
          let tempData:any= [] = data.dataset;
          this.productsSettingList = [];
          tempData.forEach((page) => {
            for (const recommendation of Object.values(page)) {
              (recommendation as Array<any>).forEach((rec) => {
            
                if(rec.recommendation_type_page_placement_id == 1){
                  this.productsSettingList.push(rec);
                }
              });
            }
          });
        // this.setSettings()
        },
      });
  }


  frequentlyBrought() {
    this.http.get<any>('http://127.0.0.1:8000/'+this.clickService.getOrgId()+'/fpe/freq_brought_together/' + this.selectedProduct ).subscribe({
      next: data => {
    
        let tempData = data.dataset[0].products;
     
         tempData.forEach((val) => {
          val['id'] = val.product_id;
          val['name'] = val.product;
          val['images'] = [{
            "big": "https://www.mastgeneralstore.com/" + val.image_url,
            "small": "https://www.mastgeneralstore.com/" + val.image_url,
            "medium": "https://www.mastgeneralstore.com/" + val.image_url
           
          }],
          val['oldPrice'] = null;
          val['newPrice'] = val.price;
          val['discount'] = 100;
          val['ratingsCount'] = 7;
          val['ratingsValue'] = 750;
          val['description'] = val.ecommeRded_products;
          val['cartCount'] = 0;
          val['categoryId'] = 0;
          val['checked'] = false;
          val['retail_price'] = val.retail_price
          this.algorythRealtedProduct.push(val);
        })
      },
      error: error => {
        console.log(error);

      }
    })
  }
  addTocart(product) {

    let productCount = parseInt(product.availibilityCount)
    let currentProduct = this.appService.Data.cartList.filter(item=>item.id == product.id)[0];
   
    this.clickService.sendMessage({ "event": "clicked", "eventType": "ADD_TO_LIST" ,"productId" : product.id });
    if(currentProduct){
      if((currentProduct.cartCount + this.count) <= productCount){
        product.cartCount = currentProduct.cartCount + this.count;
      }
      else{
        this.snackBar.open('You can not add more items than available. In stock ' + productCount + ' items and you already added ' + currentProduct.cartCount + ' item to your cart', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
        return false;
      }
    }
    else{
      product.cartCount = this.count;
    }
    this.clickService.updateProductTrack("lastStatus","addToCart")
    this.appService.addToCart(product);
  }
  AddProductinCart(e, item) {
    if (e.checked) {
      const index = this.frequentlyBoughtArray.findIndex(
        (arrayItem) => arrayItem.id === item.id
      );
      if (index === -1) {
        this.frequentlyBoughtArray.push(item);
        this.totalPrice = parseFloat(this.totalPrice)+ parseFloat(item.newPrice);
      }
    } else {
      const index = this.frequentlyBoughtArray.findIndex(
        (arrayItem) => arrayItem.id === item.id
      );
      
      if (index !== -1) {
        this.frequentlyBoughtArray.splice(index, 1);
        this.totalPrice = parseFloat(this.totalPrice)-parseFloat(item.newPrice);
      }
  }
  }
  fpeAdtoCart() {
    // this.addTocart(this.algorythRealtedProduct[0])
    // this.addTocart(this.algorythRealtedProduct[1])
    if(this.frequentlyBoughtArray.length){
      this.frequentlyBoughtArray.forEach((val)=>{
        this.addTocart(val);
      })
    }
    
  }

  addToWish(product) {
    this.clickService.sendMessage({ "event": "clicked", "eventType": "ADD_TO_LIST" ,"productId" : product.id });
    this.appService.addToWishList(product);
  }

  ngAfterViewInit() {
    this.config = {
      observer: false,
      slidesPerView: 4,
      spaceBetween: 10,
      keyboard: true,
      navigation: true,
      pagination: false,
      loop: false,
      preloadImages: false,
      lazy: true,
      breakpoints: {
        480: {
          slidesPerView: 2
        },
        600: {
          slidesPerView: 3,
        }
      }
    }
    this.config1 = {
      slidesPerView: 7,
      spaceBetween: 16,         
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,  
      loop: true,
      preloadImages: false,
      lazy: true,     
      autoplay: {
        delay: 6000,
        disableOnInteraction: false
      },
      speed: 500,
      effect: "slide",
      breakpoints: {
        320: {
          slidesPerView: 1
        },
        480: {
          slidesPerView: 2
        },
        600: {
          slidesPerView: 3,
        },
        960: {
          slidesPerView: 4,
        },
        1280: {
          slidesPerView: 5,
        },
        1500: {
          slidesPerView: 6,
        }
      }
    }
  }
  getMyproduct(id) {
    this.algorythRealtedProduct = [];
    let state = localStorage.getItem(id);
    this.currentProductSearchValue = JSON.parse(state);
    this.timeAndVisitTracker.startTracking();
    let seconds;
    let isSendMsg = true;
    this.dataSubscription = this.timeAndVisitTracker.getData().subscribe(data => {
      this.elapsedTime = data.elapsedTime;
      this.pageVisits = data.pageVisits;
      seconds = this.elapsedTime / 10000;
        if(seconds >= 4 && isSendMsg){
          isSendMsg = false;
          seconds = 0;

          this.clickService.sendMessage({ "event": "clicked", "eventType": "GENRE_VIEW" ,"productId" : id });
        }
    });
    this.spinner.show();
    this.http.get<any>('http://127.0.0.1:8000/'+this.clickService.getOrgId()+'/product/' + id).subscribe({
      next: data => {
        let prodData = data.dataset;
        this.selectedProductData = { 
          availibilityCount: prodData[0].inventory_count,
          id:prodData[0].product_id,
          cartCount: 0,
          categoryId: 100,
          department : prodData[0].dept,
          color: [
            '#474543',
            '#8B8B8B',
            '#FFFFFF'
          ],
          images: [{
            "big": "https://www.mastgeneralstore.com/" + prodData[0].image_url,
            "small": "https://www.mastgeneralstore.com/" + prodData[0].image_url,
            "medium": "https://www.mastgeneralstore.com/" + prodData[0].image_url
           
          }],
          name: prodData[0].product, 
          newPrice: prodData[0].price,
          ratingsCount: 12,

          ratingsValue: 150,
          size: prodData[0].size,
          weight: 150,
          storeid : prodData[0].storeid,
          weeklyspecials : prodData[0].weeklyspecials,
          description: prodData[0].romantic_copy_long,
          checked : true,
          isDisabled : true,
          product : prodData[0].product
        }
        this.totalPrice = this.selectedProductData.newPrice;
        this.algorythRealtedProduct.push(this.selectedProductData);
        this.frequentlyBoughtArray.push(this.selectedProductData);
        this.spinner.hide();
        setTimeout(() => {
          this.frequentlyBrought();
          this.getYoumayAlsoLike(id, prodData[0].product)
          this.config.observer = true;
          if(this.productsSettingList.length) {
            this.productsSettingList.forEach(element => {
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
                if(element.status == "true") {
                  this.getRelatedProducts(id, prodData[0].product);
                }
              }
              if(element.recommendation_type == "Discover more options") {
                if(element.status == 'true') {
                  this.getRelatedProductsKnn(id, prodData[0].product);
                }
              }
              if(element.recommendation_type_id == 3) {
                if(element.status == 'true') {
                 
                  this.getAlsoBuyProducts(id, prodData[0].product);
                }
              }
             
            });
          } else {
            this.exploreMoreItem();
            this.recommendMoreItem();
            this.getRelatedProducts(id, prodData[0].product);
            this.getRelatedProductsKnn(id, prodData[0].product);
            this.getAlsoBuyProducts(id, prodData[0].product);
          }
        });
      
      },
      error: error => {
        console.log(error);

      }
    })
  }



  public getProductById(id) {
    this.appService.getProductById(id).subscribe(data => {
    
      this.product = data;
      this.image = data.images[0].medium;
      this.zoomImage = data.images[0].big;
      setTimeout(() => {
        this.config.observer = true;
        // this.directiveRef.setIndex(0);
      });
    });
  }

  // public getRelatedProducts() {
  //   this.appService.getProducts('related').subscribe(data => {
  //     this.relatedProducts = data;


  //   })
  // }

  public getRelatedProducts(id,name){
    this.http.get<any>('http://127.0.0.1:8000/rec/'+this.clickService.getOrgId()+'/similar_products/' + id + '/' + this.clickService.getUser() + '/' + this.pageNumber + '/' + '100').subscribe({
      next: data => {
        let query;
        if(this.currentProductSearchValue !=null){
       query = this.currentProductSearchValue.query;
        }else{
          query = '';
        }
        let demo;
        demo = data.dataset.products;

        demo.forEach((val)=>{
          val['id'] = val.product_id;
          val['color'] =   [
              "#5C6BC0",
              "#66BB6A",
              "#90A4AE"
          ]
          val['availibilityCount'] = 5;
          val['cartCount'] = 0;
          val['description'] =val.Romantic_Copy_Short;
          val['discount'] = null;
          val['name'] =val.name;
          val['newPrice'] = val.price;
          val['oldPrice'] =null;
          val['ratingsCount'] = 3;
          val['ratingsValue']= 4;
          val['size'] = val.size;
          val['weight'] = null;
          val['brand'] = val.brand;
          val['storeid'] = val.store_id;
          val['sub_type'] = val.subtype;
          val['thumbnailurl'] = val.image_url;
          val['clickValue'] = "Product + similar_products";
          val['dept'] = val.dept,
          val['user_recommendation_id'] = 1;
          val['recommendation_type_id'] = 1;
          val['pageName'] = 'Product Page';
          val['recommendation_type'] = 'similar_products';
          val['query'] = query
          val['images'] =  [{
            "big": "https://www.mastgeneralstore.com/" + val.image_url,
            "small": "https://www.mastgeneralstore.com/" + val.image_url,
            "medium": "https://www.mastgeneralstore.com/" + val.image_url
           
          }]
          
        })
        this.newRelatedProducts = demo;
      },
      error: error => {
          console.log(error);
          
      }
  })
 
  }
  public getYoumayAlsoLike(id,name){
    this.youMay = [];
    this.http.get<any>('http://127.0.0.1:8000/'+this.clickService.getOrgId()+'/fpe/you_may_also_like/' + id +'/' + 1 +'/' + 100 ).subscribe({
      next: data => {
        let query;
        if(this.currentProductSearchValue !=null){
       query = this.currentProductSearchValue.query;
        }else{
          query = '';
        }
        let demo;
        demo = data.dataset.products[0].products;

        demo.forEach((val)=>{
          val['id'] = val.product_id;
          val['color'] =   [
              "#5C6BC0",
              "#66BB6A",
              "#90A4AE"
          ]
          val['availibilityCount'] = 5;
          val['cartCount'] = 0;
          val['description'] =val.Romantic_Copy_Short;
          val['discount'] = null;
          val['name'] =val.product;
          val['newPrice'] = val.price;
          val['oldPrice'] =null;
          val['ratingsCount'] = 3;
          val['ratingsValue']= 4;
          val['size'] = val.size;
          val['weight'] = null;
          val['brand'] = val.brand;
          val['storeid'] = val.store_id;
          val['sub_type'] = val.subtype;
          val['thumbnailurl'] = val.image_url;
          val['clickValue'] = "Product + similar_products";
          val['dept'] = val.dept,
          val['user_recommendation_id'] = 1;
          val['recommendation_type_id'] = 1;
          val['pageName'] = 'Product Page';
          val['recommendation_type'] = 'similar_products';
          val['query'] = query
          val['images'] =  [{
            "big": "https://www.mastgeneralstore.com/" + val.image_url,
            "small": "https://www.mastgeneralstore.com/" + val.image_url,
            "medium": "https://www.mastgeneralstore.com/" + val.image_url
           
          }]
          
        })
        this.youMay = demo;
      },
      error: error => {
          console.log(error);
          
      }
  })
 
  }
  public recommendMoreItem() {
    this.http.get<any>('http://127.0.0.1:8000/rec/'+this.clickService.getOrgId()+'/recommend_more_products/' + this.clickService.getUser() + '/' + '1' + '/' + '100').subscribe({
      next: data => {
        let query;
        if(this.currentProductSearchValue !=null){
       query = this.currentProductSearchValue.query;
        }else{
          query = '';
        }

        let demo;
        demo = data.dataset.products;

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
          val['query'] = query,
            val['images'] = [{
              "big": "https://www.mastgeneralstore.com/" + val.image_url,
              "small": "https://www.mastgeneralstore.com/" + val.image_url,
              "medium": "https://www.mastgeneralstore.com/" + val.image_url

            }]
        })
        this.recommendMoreProducts = demo;
      },
      error: error => {
        console.log(error);

      }
    })

  }
  public getRelatedProductsKnn(id,name){
    this.http.get<any>('http://127.0.0.1:8000/rec/'+this.clickService.getOrgId()+'/similar_products_using_knn/' + id + '/' + this.clickService.getUser() + '/' + this.pageNumber + '/' + '100').subscribe({
      next: data => {
        let query;
        if(this.currentProductSearchValue !=null){
       query = this.currentProductSearchValue.query;
        }else{
          query = '';
        }
        let demo;
        demo = data.dataset.products;

        demo.forEach((val)=>{
          val['id'] = val.product_id;
          val['color'] =   [
              "#5C6BC0",
              "#66BB6A",
              "#90A4AE"
          ]
          val['availibilityCount'] = 5;
          val['cartCount'] = 0;
          val['description'] =val.Romantic_Copy_Short;
          val['discount'] = null;
          val['name'] =val.name;
          val['newPrice'] = val.price;
          val['oldPrice'] =null;
          val['ratingsCount'] = 3;
          val['ratingsValue']= 4;
          val['size'] = val.size;
          val['weight'] = null;
          val['brand'] = val.brand;
          val['storeid'] = val.store_id;
          val['sub_type'] = val.subtype;
          val['thumbnailurl'] = val.image_url;
          val['clickValue'] = "Product + similar_products_using_knn";
          val['dept'] = val.dept,
          val['user_recommendation_id'] = 2;
          val['recommendation_type_id'] = 2;
          val['pageName'] = 'Product Page';
          val['recommendation_type'] = 'similar_products_using_knn';
          val['query'] = query,
          val['images'] =  [{
            "big": "https://www.mastgeneralstore.com/" + val.image_url,
            "small": "https://www.mastgeneralstore.com/" + val.image_url,
            "medium": "https://www.mastgeneralstore.com/" + val.image_url
           
          }]
          
        })
        this.newRelatedProductsKnn = demo;
      },
      error: error => {
          console.log(error);
          
      }
  })
 
  }

  public getAlsoBuyProducts(id,name){
    this.http.get<any>('http://127.0.0.1:8000/rec/'+this.clickService.getOrgId()+'/products_by_customer_viewed/' + id + '/' + this.clickService.getUser() + '/' + this.pageNumber + '/' + '100').subscribe({
      next: data => {
        let query;
        if(this.currentProductSearchValue !=null){
       query = this.currentProductSearchValue.query;
        }else{
          query = '';
        }
        let demo;
        demo = data.dataset.products;

        demo.forEach((val)=>{
          val['id'] = val.product_id;
          val['color'] =   [
              "#5C6BC0",
              "#66BB6A",
              "#90A4AE"
          ]
          val['availibilityCount'] = 5;
          val['cartCount'] = 0;
          val['description'] =val.Romantic_Copy_Short;
          val['discount'] = null;
          val['name'] =val.product;
          val['newPrice'] = val.price;
          val['oldPrice'] =null;
          val['ratingsCount'] = 3;
          val['ratingsValue']= 4;
          val['size'] = val.size;
          val['weight'] = null;
          val['brand'] = val.brand;
          val['storeid'] = val.store_id;
          val['sub_type'] = val.subtype;
          val['thumbnailurl'] = val.image_url;
          val['clickValue'] = "Product + products_by_customer_viewed";
          val['dept'] = val.dept,
          val['user_recommendation_id'] = 3;
          val['recommendation_type_id'] = 3;
          val['pageName'] = 'Product Page';
          val['recommendation_type'] = 'products_by_customer_viewed';
          val['query'] = query,
          val['images'] =  [{
            "big": "https://www.mastgeneralstore.com/" + val.image_url,
            "small": "https://www.mastgeneralstore.com/" + val.image_url,
            "medium": "https://www.mastgeneralstore.com/" + val.image_url
           
          }]
        })
        this.alsoBuyProducts = demo;
      },
      error: error => {
          console.log(error);
          
      }
  })
 
  }
  public exploreMoreItem(){
    this.http.get<any>('http://127.0.0.1:8000/rec/'+this.clickService.getOrgId()+'/explore_more_items/' + this.clickService.getUser() + '/' + this.pageNumber + '/' + '100').subscribe({
      next: data => {
        let query;
        if(this.currentProductSearchValue !=null){
       query = this.currentProductSearchValue.query;
        }else{
          query = '';
        }
        let demo;
        demo = data.dataset.products;

        demo.forEach((val)=>{
          val['id'] = val.product_id;
          val['color'] =   [
              "#5C6BC0",
              "#66BB6A",
              "#90A4AE"
          ]
          val['availibilityCount'] = 5;
          val['cartCount'] = 0;
          val['description'] =val.Romantic_Copy_Short;
          val['discount'] = null;
          val['name'] =val.product;
          val['newPrice'] = val.price;
          val['oldPrice'] =null;
          val['ratingsCount'] = 3;
          val['ratingsValue']= 4;
          val['size'] = val.size;
          val['weight'] = null;
          val['brand'] = val.brand;
          val['storeid'] = val.store_id;
          val['sub_type'] = val.subtype;
          val['thumbnailurl'] = val.image_url;
          val['clickValue'] = "Product + explore_more_items";
          val['dept'] = val.dept,
          val['user_recommendation_id'] = 4;
          val['recommendation_type_id'] = 4;
          val['pageName'] = 'Product Page';
          val['recommendation_type'] = 'explore_more_items_based_on_purchased_history';
          val['query'] = query,
          val['images'] =  [{
            "big": "https://www.mastgeneralstore.com/" + val.image_url,
            "small": "https://www.mastgeneralstore.com/" + val.image_url,
            "medium": "https://www.mastgeneralstore.com/" + val.image_url
           
          }]
        })
        this.exploreMoreProducts = demo;
      },
      error: error => {
          console.log(error);
          
      }
  })
 
  }



  public selectImage(image) {
    this.image = image.medium;
    this.zoomImage = image.big;
  }

  public onMouseMove(e) {
    // if (window.innerWidth >= 1280) {
    //   var image, offsetX, offsetY, x, y, zoomer;
    //   image = e.currentTarget;
    //   offsetX = e.offsetX;
    //   offsetY = e.offsetY;
    //   x = offsetX / image.offsetWidth * 100;
    //   y = offsetY / image.offsetHeight * 100;
    //   zoomer = this.zoomViewer.nativeElement.children[0];
    //   if (zoomer) {
    //     zoomer.style.backgroundPosition = x + '% ' + y + '%';
    //     zoomer.style.display = "block";
    //     zoomer.style.height = image.height + 'px';
    //     zoomer.style.width = image.width + 'px';
    //   }
    // }
  }

  public onMouseLeave(event) {
    // this.zoomViewer.nativeElement.children[0].style.display = "none";
  }

  public openZoomViewer() {
    this.dialog.open(ProductZoomComponent, {
      data: this.selectedProductData.images[0].big,
      panelClass: 'zoom-dialog'
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public onSubmit(values: Object): void {
    if (this.form.valid) {
      //email sent
    }
   
  }
  sendMsg(e){
    this.clickService.sendMessage({ "event": "clicked", "eventType": "ADD_TO_LIST" ,"productId" : this.selectedProductData.id});
    }
    onTabSelected(event){
    }
}