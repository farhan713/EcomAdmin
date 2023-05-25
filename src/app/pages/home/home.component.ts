import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Product } from "../../app.models";
import { HttpClient } from "@angular/common/http";
import { ClickStreamService } from '../../shared/services/click-stream.service'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public slides = [
    { title: 'The biggest sale', subtitle: 'Special for today', image: 'assets/images/carousel/banner1.jpg' },
    { title: 'Summer collection', subtitle: 'New Arrivals On Sale', image: 'assets/images/carousel/banner2.jpg' },
    { title: 'The biggest sale', subtitle: 'Special for today', image: 'assets/images/carousel/banner3.jpg' },
    { title: 'Summer collection', subtitle: 'New Arrivals On Sale', image: 'assets/images/carousel/banner4.jpg' },
    { title: 'The biggest sale', subtitle: 'Special for today', image: 'assets/images/carousel/banner5.jpg' }
  ];
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

  public brands = [];
  public banners = [];
  public featuredProducts: Array<Product>;
  public onSaleProducts: Array<Product>;
  public topRatedProducts: Array<Product>;
  public newArrivalsProducts: Array<Product>;

  categoryData: any = [];
  fishingData: any;
  hardwareData: any;
  petroliumData: any;
  yardDta: any;

  trendingProdauctsArray: any = [];
  monthsPopularArray: any = [];
  topSellngArray: any = [];
  productsByPrcieLimitArray: any = [];
  recommendMoreProducts: any = [];
  settingList: any = [];

  userId: any;
  exploreMoreProducts: any = [];
  homePageSettings: any = [];
  orgnizationData: any;
  demoorg: any;
  orgnizationDetails: any;

  constructor(public appService: AppService,
    private ref: ChangeDetectorRef,
    private clickService: ClickStreamService,
    private http: HttpClient) {
    // this.getProducts("FISHING/MARINE")
  }

  ngOnInit() {

    setTimeout(() => {
      let sessionId = this.clickService.getSessionId();
    }, 2000);

    this.clickService.loginEvent
      .subscribe((id: string) => {
        this.initPage();
      });
    this.initPage();
    this.clickService.connect();
    setTimeout(() => {
      this.clickService.sendMessage({ "event": "click", "eventType": "SEARCHED_PRODUCT_VIEW", "productName": "jeans" });
    }, 2000);

  }
  
  getSettings() {
    this.http
      .get<any>(
        "http://127.0.0.1:8000/console/"+this.clickService.getOrgId()+"/dashboard/pagename_details/"
      )
      .subscribe({
        next: (data) => {
          let tempData:any= [] = data.dataset;
          this.homePageSettings = [];
          tempData.forEach((page) => {
            for (const recommendation of Object.values(page)) {
              (recommendation as Array<any>).forEach((rec) => {
                if(rec.recommendation_type_page_placement_id == 2){
                  this.homePageSettings.push(rec);
                }
              });
            }
          });
        this.setSettings()
        },
      });
  }

  initPage() {
    this.userId = this.clickService.getUser();
  
    if(this.userId != '-1') {
      this.getSettings()
    }
    this.getBrands();
   

  }
 

  setSettings() {
    if (this.homePageSettings.length) {
      this.homePageSettings.forEach(element => {
        if (element.recommendation_type == "Explore More Items") {
          if (element.status == 'true') {
            this.exploreMoreItem();
         }
        }
        if (element.recommendation_type == "Recommended for you") {
          if (element.status == 'true') {
            this.recommendMoreItem();
          }
        }
        if (element.recommendation_type == "Check Out Similar Item") {
          if (element.status == 'true') {

          }
        }
        if (element.recommendation_type == "Discover more options") {
          if (element.status == 'true') {

          }
        }
        if (element.recommendation_type == "Customers also viewed") {
          if (element.status == 'true') {

          }
        }
        if (element.recommendation_type == "Check Out Similar Item") {
          if (element.status == 'true') {

          }
        }
      });
    } else {
      this.exploreMoreItem();
      // this.getTopCatogories();
      this.recommendMoreItem();
    }

  }


  getTrendingProducts() {
    this.http.post<any>('http://127.0.0.1:8000/trending_products_today/' + this.userId, { date: "2022-11-25" }).subscribe({
      next: data => {
        data.dataset.forEach((element, i) => {
          if (i < 4) {
            element.image_url = 'https://www.mastgeneralstore.com/' + element.image_url
            this.trendingProdauctsArray.push(element)
          }
        });
        this.ref.detectChanges();
      },
      error: error => {
        console.log(error);

      }
    })
  }

  getThisMonthsPopular() {
    this.http.post<any>('http://127.0.0.1:8000/this_month_popular_products/' + this.userId, { month: 2 }).subscribe({
      next: data => {
        data.dataset.forEach((element, i) => {
          if (i < 4) {
            element.image_url = 'https://www.mastgeneralstore.com/' + element.image_url
            this.monthsPopularArray.push(element)
          }
        });
        this.ref.detectChanges();
      },
      error: error => {
        console.log(error);

      }
    })
  }

  getTopSelling() {
    this.http.post<any>('http://127.0.0.1:8000/top_selling_products/' + this.userId, {}).subscribe({
      next: data => {
        data.dataset.forEach((element, i) => {
          if (i < 4) {
            element.image_url = 'https://www.mastgeneralstore.com/' + element.image_url
            this.topSellngArray.push(element)
          }
        });
        this.ref.detectChanges();
      },
      error: error => {
        console.log(error);

      }
    })
  }

  getProductsByPriceLimit() {
    this.http.post<any>('http://127.0.0.1:8000/under_price_limit/' + this.userId, { price: 1 }).subscribe({
      next: data => {
        data.dataset.forEach((element, i) => {
          if (i < 4) {
            element.image_url = 'https://www.mastgeneralstore.com/' + element.image_url
            this.productsByPrcieLimitArray.push(element)
          }
        });
        this.ref.detectChanges();
      },
      error: error => {
        console.log(error);

      }
    })
  }

  getData() {
    this.http.post<any>('http://127.0.0.1:5000/PopularCategory', {}).subscribe({
      next: data => {
        localStorage.setItem("categoryData", JSON.stringify(data))
        this.categoryData = data.Category
        this.ref.detectChanges();
      },
      error: error => {
        console.log(error);

      }
    })
  }

  public onLinkClick(e) {
    this.getProducts(e.tab.textLabel);
  }

  public getProducts(type) {
    let cat = localStorage.getItem("categoryData");
    if (cat) {
      let cat1 = JSON.parse(cat);
      this.categoryData = cat1.Category;
    } else {
      this.http.post<any>('http://127.0.0.1:5000/PopularCategory', {}).subscribe({
        next: data => {
          localStorage.setItem("categoryData", JSON.stringify(data))
          this.categoryData = data.Category;
          this.ref.detectChanges();
        },
        error: error => {
          console.log(error);

        }
      })
    }
    if (type == "FISHING/MARINE" && !this.featuredProducts) {
      let f = JSON.parse(this.categoryData['FISHING/MARINE']);
      f.data.forEach(val => {
        val['id'] = val.index;
        val['name'] = val.DESCRIPTION;
        val['images'] = this.images;
        val['oldPrice'] = null;
        val['newPrice'] = 475;
        val['discount'] = 100;
        val['ratingsCount'] = 7;
        val['ratingsValue'] = 750;
        val['description'] = val.BRAND;
        val['cartCount'] = 0;
        val['categoryId'] = 0;
      });
      this.fishingData = f.data

      // this.appService.getProducts("featured").subscribe(data=>{
      //   this.featuredProducts = data;      
      // }) 
    }
    if (type == "HARDWARE/PAINT" && !this.onSaleProducts) {
      let h = JSON.parse(this.categoryData['HARDWARE/PAINT']);
      h.data.forEach(val => {
        val['id'] = val.index;
        val['name'] = val.DESCRIPTION;
        val['images'] = this.images;
        val['oldPrice'] = null;
        val['newPrice'] = 475;
        val['discount'] = 100;
        val['ratingsCount'] = 7;
        val['ratingsValue'] = 750;
        val['description'] = val.BRAND;
        val['cartCount'] = 0;
        val['categoryId'] = 0;
      });
      // this.fishingData = f.data
      this.hardwareData = h.data
      // this.appService.getProducts("on-sale").subscribe(data=>{
      //   this.onSaleProducts = data;      
      // })
    }
    if (type == "PETROLEUM" && !this.topRatedProducts) {
      let p = JSON.parse(this.categoryData['PETROLEUM']);
      p.data.forEach(val => {
        val['id'] = val.index;
        val['name'] = val.DESCRIPTION;
        val['images'] = this.images;
        val['oldPrice'] = null;
        val['newPrice'] = 475;
        val['discount'] = 100;
        val['ratingsCount'] = 7;
        val['ratingsValue'] = 750;
        val['description'] = val.BRAND;
        val['cartCount'] = 0;
        val['categoryId'] = 0;
      });
      this.petroliumData = p.data
      // this.appService.getProducts("top-rated").subscribe(data=>{
      //   this.topRatedProducts = data;      
      // })
    }
    if (type == "YARD/GARDEN OUTDOOR LIVING" && !this.newArrivalsProducts) {
      let y = JSON.parse(this.categoryData['YARD/GARDEN OUTDOOR LIVING']);
      y.data.forEach(val => {
        val['id'] = val.index;
        val['name'] = val.DESCRIPTION;
        val['images'] = this.images;
        val['oldPrice'] = null;
        val['newPrice'] = 475;
        val['discount'] = 100;
        val['ratingsCount'] = 7;
        val['ratingsValue'] = 750;
        val['description'] = val.BRAND;
        val['cartCount'] = 0;
        val['categoryId'] = 0;
      });
      this.yardDta = y.data
    }

  }


  // public getTopCatogories() {
  //   this.http.get<any>('http://127.0.0.1:8000/categories').
  //     subscribe({
  //       next: data => {
  //         let demo = data.dataset.map((val) => {
  //           return { title: val, image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-0.3.5&s=a8ef3fd4a48693a0620b614a6209b687&auto=format&fit=crop&w=750&q=80', subtitle: 'Top In Categories' }
  //         })
  //         this.banners = demo;
  //       },
  //       error: error => {
  //         console.log(error);

  //       }
  //     })

  // }
  checkPageName(name) {
  }

  public exploreMoreItem() {
    this.http.get<any>('http://127.0.0.1:8000/rec/'+this.clickService.getOrgId()+'/explore_more_items/' + this.clickService.getUser() + '/' + '1' + '/' + '100').subscribe({
      next: data => {
        let demo;
        demo = data.dataset.products;
        if (demo) {
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
        if (demo) {
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


  public getBrands() {
    this.brands = this.appService.getBrands();
  }

}
