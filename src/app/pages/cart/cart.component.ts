import { Component, OnInit } from "@angular/core";
import { Data, AppService } from "../../app.service";
import { HttpClient } from "@angular/common/http";
import { ClickStreamService } from "src/app/shared/services/click-stream.service";
import { Router } from "@angular/router";
import { log } from "console";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
})
export class CartComponent implements OnInit {
  total = [];
  purchased: boolean = false;
  images: any = [
    {
      small:
        "https://via.placeholder.com/180x135/4DB6AC/fff/?text=Related Product 1",
      medium:
        "https://via.placeholder.com/480x365/4DB6AC/fff/?text=Related Product 1",
      big: "https://via.placeholder.com/960x720/4DB6AC/fff/?text=Related Product 1",
    },
    {
      small:
        "https://via.placeholder.com/180x135/4DB6AC/fff/?text=Related Product 1",
      medium:
        "https://via.placeholder.com/480x365/4DB6AC/fff/?text=Related Product 1",
      big: "https://via.placeholder.com/960x720/4DB6AC/fff/?text=Related Product 1",
    },
    {
      small:
        "https://via.placeholder.com/180x135/4DB6AC/fff/?text=Related Product 1",
      medium:
        "https://via.placeholder.com/480x365/4DB6AC/fff/?text=Related Product 1",
      big: "https://via.placeholder.com/960x720/4DB6AC/fff/?text=Related Product 1",
    },
  ];
  grandTotal = 0;
  cartItemCount = [];
  cartItemCountTotal = 0;
  productDemo: {
    availibilityCount: number;
    cartCount: number;
    categoryId: number;
    color: string[];
    images: { small: string; medium: string; big: string }[];
    name: any;
    newPrice: number;
    ratingsCount: number;
    ratingsValue: number;
    size: string[];
    weight: number;
  };
  algorythRealtedProduct: any;
  youMay: any = [];
  cartSettingList: any = [];
  exploreMoreProducts: any = [];
  pageNumber = 1;
  newRelatedProductsKnn: any = [];
  alsoBuyProducts: any = [];
  currentProductSearchValue: any;
  newRelatedProducts: any = [];
  prodId: any;
  recommendMoreProducts: any = [];
  constructor(
    public appService: AppService,
    public router: Router,
    private clickService: ClickStreamService,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit() {
    let clickProductList = [];
    this.appService.Data.cartList.forEach((product) => {
      let myPro = localStorage.getItem(product.id.toString());
      if (myPro) {
        clickProductList.push(JSON.parse(myPro));
      }
      this.total[product.id] = product.cartCount * product.newPrice;
      this.grandTotal += product.cartCount * product.newPrice;
      this.cartItemCount[product.id] = product.cartCount;
      this.cartItemCountTotal += product.cartCount;
    });
if(clickProductList.length){
      let state = localStorage.getItem(clickProductList[0].product);
      this.currentProductSearchValue = JSON.parse(state);
    this.prodId =clickProductList[0].product
   
    this.getSettings();
  }  
  }

  public updateCart(value) {
    if (value) {
      this.total[value.productId] = value.total;
      this.cartItemCount[value.productId] = value.soldQuantity;
      this.grandTotal = 0;
      this.total.forEach((price) => {
        this.grandTotal += price;
      });
      this.cartItemCountTotal = 0;
      this.cartItemCount.forEach((count) => {
        this.cartItemCountTotal += count;
      });

      this.appService.Data.totalPrice = this.grandTotal;
      this.appService.Data.totalCartCount = this.cartItemCountTotal;

      this.appService.Data.cartList.forEach((product) => {
        this.cartItemCount.forEach((count, index) => {
          if (product.id == index) {
            product.cartCount = count;
          }
        });
      });
    }
  }

  public remove(product) {
    const index: number = this.appService.Data.cartList.indexOf(product);
    if (index !== -1) {
      this.appService.Data.cartList.splice(index, 1);
      this.grandTotal = this.grandTotal - this.total[product.id];
      this.appService.Data.totalPrice = this.grandTotal;
      this.total.forEach((val) => {
        if (val == this.total[product.id]) {
          this.total[product.id] = 0;
        }
      });

      this.cartItemCountTotal =
        this.cartItemCountTotal - this.cartItemCount[product.id];
      this.appService.Data.totalCartCount = this.cartItemCountTotal;
      this.cartItemCount.forEach((val) => {
        if (val == this.cartItemCount[product.id]) {
          this.cartItemCount[product.id] = 0;
        }
      });
      this.appService.resetProductCartCount(product);
    }
  }
  updateProductTrack() {
    let clickProductList = [];
    this.appService.Data.cartList.forEach((product) => {
  
      this.clickService.sendMessage({
        event: "keyup",
        eventType: "PURCHASED",
        productId: product.id,
      });
      let myPro = localStorage.getItem(product.id.toString());
      // console.log(myPro);

      if (myPro) {
        let parsePro = JSON.parse(myPro);
        parsePro["quantity"] = product.cartCount;
        parsePro["price"] = product.newPrice;
        clickProductList.push(parsePro);
      }
    });
    // console.log(clickProductList);

    let productsToSend = [];
    clickProductList.forEach((element) => {
      let typeId;
      let userRecId;

      this.clickService.userVisit(
        this.clickService.getSessionId(),
        this.grandTotal,
        "false",
        "false"
      );
      if (element.user_recommendation_id) {
        userRecId = element.user_recommendation_id;
      } else {
        userRecId = -1;
      }

      if (element.recommendation_type_id) {
        typeId = element.recommendation_type_id;
      } else {
        typeId = -1;
      }

      let pageName;
      if (element.pageName) {
        pageName = element.pageName;
      } else {
        pageName = "";
      }
    
    if(typeId == -1 && !element.query){
     
      productsToSend.push({
        org_id: this.clickService.getOrgId(),
        store_id: -1,
        sku_id: element.product,
        price: element.price,
        quantity: element.quantity,
        search_query: element.query ? element.query : "",
        user_recommendation_id: userRecId,
        recommendation_type_id: typeId,
        is_searched:  "false",
        is_recommended:  "false",
        recommendation_page_name: pageName,
      });
    }else if(typeId != -1)
    {
     
      productsToSend.push({
        org_id:  this.clickService.getOrgId(),
        store_id: -1,
        sku_id: element.product,
        price: element.price,
        quantity: element.quantity,
        search_query: "",
        user_recommendation_id: userRecId,
        recommendation_type_id: typeId,
        is_searched:  "false",
        is_recommended:  "true" ,
        recommendation_page_name: pageName,
     })
    } else  {
     
      productsToSend.push({
        org_id:  this.clickService.getOrgId(),
        store_id: -1,
        sku_id: element.product,
        price: element.price,
        quantity: element.quantity,
        search_query: element.query ? element.query : "",
        user_recommendation_id: userRecId,
        recommendation_type_id: typeId,
        is_searched:  "true",
        is_recommended:  "false" ,
        recommendation_page_name: pageName,
      });
    }
    
    });
    // console.log(productsToSend);

    let data = {
      status_code: 200,
      data_tables: [
        {
          table_name: "tb_order",
          data: {
            org_id: this.clickService.getOrgId(),
            store_id: [],
            user_id: parseInt(this.clickService.getUser()),
            total: this.grandTotal,
            total_item: clickProductList.reduce(
              (total, obj) => obj.quantity + total,
              0
            ),
          },
        },
        {
          table_name: "tb_order_details",
          data: productsToSend,
        },
      ],
    };
  
    console.log(data);
    
    this.spinner.show();
    this.http
      .post<any>("http://127.0.0.1:8000/console/order", { response: data })
      .subscribe({
        next: (data) => {
          // console.log(data);
          this.spinner.hide()
          this.router.navigate(["/order-placed"]);
          this.appService.emptyCart();
          if (clickProductList.length) {
            clickProductList.forEach((element) => {
              localStorage.removeItem(element.product);
            });
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
    this.clickService.updateProductTrack("lastStatus", "proceedToCheckout");
  }

  public clear() {
    this.appService.Data.cartList.forEach((product) => {
      this.appService.resetProductCartCount(product);
    });
    this.appService.Data.cartList.length = 0;
    this.appService.Data.totalPrice = 0;
    this.appService.Data.totalCartCount = 0;
  }

  public getYoumayAlsoLike(id) {
    this.youMay = [];
    this.http.get<any>('http://127.0.0.1:8000/'+this.clickService.getOrgId()+'/fpe/you_may_also_like/' + id +'/' + 1 +'/' + 100 ).subscribe({
        next: (data) => {
          // console.log(data)

          let query = this.currentProductSearchValue.query;
          let demo;
          demo = data.dataset.products[0].products;

          demo.forEach((val) => {
            let cartCountLocal;

            if (
              this.appService.Data.cartList.filter(
                (item) => item.id == val.product_id
              )[0]
            ) {
              let item = this.appService.Data.cartList.filter(
                (item) => item.id == val.product_id
              )[0];
              cartCountLocal = item.cartCount;
            } else {
              cartCountLocal = 0;
            }
            val["id"] = val.product_id;
            val["color"] = ["#5C6BC0", "#66BB6A", "#90A4AE"];
            val["availibilityCount"] = 5;
            val["cartCount"] = cartCountLocal;
            val["description"] = val.Romantic_Copy_Short;
            val["discount"] = null;
            val["name"] = val.product;
            val["newPrice"] = val.price;
            val["oldPrice"] = null;
            val["ratingsCount"] = 3;
            val["ratingsValue"] = 4;
            val["size"] = val.size;
            val["weight"] = null;
            val["brand"] = val.brand;
            val["storeid"] = val.store_id;
            val["sub_type"] = val.subtype;
            val["thumbnailurl"] = val.image_url;
            val["clickValue"] = "Product + similar_products";
            (val["dept"] = val.dept), (val["user_recommendation_id"] = 1);
            val["recommendation_type_id"] = 1;
            val["pageName"] = "Product Page";
            val["recommendation_type"] = "similar_products";
            val["query"] = query;
            val["images"] = [
              {
                big: "https://www.mastgeneralstore.com/" + val.image_url,
                small: "https://www.mastgeneralstore.com/" + val.image_url,
                medium: "https://www.mastgeneralstore.com/" + val.image_url,
              },
            ];
          });
          this.youMay = demo;
        },
        error: (error) => {
          console.log(error);
        },
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
          this.cartSettingList = [];
          tempData.forEach((page) => {
            for (const recommendation of Object.values(page)) {
              (recommendation as Array<any>).forEach((rec) => {
              
                if(rec.recommendation_type_page_placement_id == 3){
                  this.cartSettingList.push(rec);
                }
              });
            }
          });
        // this.setSetting()
        setTimeout(()=>{
          if (this.cartSettingList.length) {
            this.cartSettingList.forEach((element) => {
              if (element.recommendation_type == "Explore More Items") {
                if (element.status == "true") {
                  this.exploreMoreItem();
                }
              }
              if (element.recommendation_type == "Recommended for you") {
                if (element.status == "true") {
                  this.recommendMoreItem();
                }
              }
              if (element.recommendation_type == "Check Out Similar Item") {
                if (element.status == "true") {
                  this.getRelatedProducts(this.prodId);
                }
              }
              if (element.recommendation_type == "Discover more options") {
                if (element.status == "true") {
                  this.getRelatedProductsKnn(this.prodId);
                }
              }
              if (element.recommendation_type == "Customers also viewed") {
                if (element.status == "true") {
                  this.getAlsoBuyProducts(this.prodId);
                }
              }
              // if(element.label == "Check Out Similar Item") {
              //   if(element.status == 'True') {
              //     // add api for similar
              //     // this.getAlsoBuyProducts(id, prodData[0].product);
              //   }
              // }
            });
          } else {
            this.exploreMoreItem();
            this.recommendMoreItem();
            this.getRelatedProducts(this.prodId);
            this.getRelatedProductsKnn(this.prodId);
            this.getAlsoBuyProducts(this.prodId);
          }
        },100)
        },
      });
  }
  setSetting() {
   
  };
  public exploreMoreItem() {
    this.http
      .get<any>(
        "http://127.0.0.1:8000/rec/"+this.clickService.getOrgId()+"/explore_more_items/" +
          this.clickService.getUser() +
          "/" +
          this.pageNumber +
          "/" +
          "100"
      )
      .subscribe({
        next: (data) => {
          // console.log(data)

          let query = this.currentProductSearchValue.query;
          let demo;
          demo = data.dataset.products;
          if(demo){
          demo.forEach((val) => {
            let cartCountLocal;

            if (
              this.appService.Data.cartList.filter(
                (item) => item.id == val.product_id
              )[0]
            ) {
              let item = this.appService.Data.cartList.filter(
                (item) => item.id == val.product_id
              )[0];
              cartCountLocal = item.cartCount;
            } else {
              cartCountLocal = 0;
            }
            val["id"] = val.product_id;
            val["color"] = ["#5C6BC0", "#66BB6A", "#90A4AE"];
            val["availibilityCount"] = 5;
            val["cartCount"] = cartCountLocal;
            val["description"] = val.Romantic_Copy_Short;
            val["discount"] = null;
            val["name"] = val.product;
            val["newPrice"] = val.price;
            val["oldPrice"] = null;
            val["ratingsCount"] = 3;
            val["ratingsValue"] = 4;
            val["size"] = val.size;
            val["weight"] = null;
            val["brand"] = val.brand;
            val["storeid"] = val.store_id;
            val["sub_type"] = val.subtype;
            val["thumbnailurl"] = val.image_url;
            val["clickValue"] = "Product + explore_more_items";
            (val["dept"] = val.dept), (val["user_recommendation_id"] = 4);
            val["recommendation_type_id"] = 4;
            val["pageName"] = "Product Page";
            val["recommendation_type"] =
              "explore_more_items_based_on_purchased_history";
            (val["query"] = query),
              (val["images"] = [
                {
                  big: "https://www.mastgeneralstore.com/" + val.image_url,
                  small: "https://www.mastgeneralstore.com/" + val.image_url,
                  medium: "https://www.mastgeneralstore.com/" + val.image_url,
                },
              ]);
          });
          this.exploreMoreProducts = demo;
        }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  public getRelatedProductsKnn(id) {
    this.http
      .get<any>(
        "http://127.0.0.1:8000/rec/"+this.clickService.getOrgId()+"/similar_products_using_knn/" +
          id +
          "/" +
          this.clickService.getUser() +
          "/" +
          this.pageNumber +
          "/" +
          "100"
      )
      .subscribe({
        next: (data) => {
          // console.log(data)

          let query = this.currentProductSearchValue.query;
          let demo;
          demo = data.dataset.products;
          if(demo){
          demo.forEach((val) => {
            let cartCountLocal;

            if (
              this.appService.Data.cartList.filter(
                (item) => item.id == val.product_id
              )[0]
            ) {
              let item = this.appService.Data.cartList.filter(
                (item) => item.id == val.product_id
              )[0];
              cartCountLocal = item.cartCount;
            } else {
              cartCountLocal = 0;
            }
            val["id"] = val.product_id;
            val["color"] = ["#5C6BC0", "#66BB6A", "#90A4AE"];
            val["availibilityCount"] = 5;
            val["cartCount"] = cartCountLocal;
            val["description"] = val.Romantic_Copy_Short;
            val["discount"] = null;
            val["name"] = val.product;
            val["newPrice"] = val.price;
            val["oldPrice"] = null;
            val["ratingsCount"] = 3;
            val["ratingsValue"] = 4;
            val["size"] = val.size;
            val["weight"] = null;
            val["brand"] = val.brand;
            val["storeid"] = val.store_id;
            val["sub_type"] = val.subtype;
            val["thumbnailurl"] = val.image_url;
            val["clickValue"] = "Product + similar_products_using_knn";
            (val["dept"] = val.dept), (val["user_recommendation_id"] = 2);
            val["recommendation_type_id"] = 2;
            val["pageName"] = "Product Page";
            val["recommendation_type"] = "similar_products_using_knn";
            (val["query"] = query),
              (val["images"] = [
                {
                  big: "https://www.mastgeneralstore.com/" + val.image_url,
                  small: "https://www.mastgeneralstore.com/" + val.image_url,
                  medium: "https://www.mastgeneralstore.com/" + val.image_url,
                },
              ]);
          });
          this.newRelatedProductsKnn = demo;
        }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  public getAlsoBuyProducts(id) {
    this.http
      .get<any>(
        "http://127.0.0.1:8000/rec/"+this.clickService.getOrgId()+"/products_by_customer_viewed/" +
          id +
          "/" +
          this.clickService.getUser() +
          "/" +
          this.pageNumber +
          "/" +
          "100"
      )
      .subscribe({
        next: (data) => {
          // console.log(data)

          let query = this.currentProductSearchValue.query;
          let demo;
          demo = data.dataset.products;
          if(demo){
          demo.forEach((val) => {
            let cartCountLocal;

            if (
              this.appService.Data.cartList.filter(
                (item) => item.id == val.product_id
              )[0]
            ) {
              let item = this.appService.Data.cartList.filter(
                (item) => item.id == val.product_id
              )[0];
              cartCountLocal = item.cartCount;
            } else {
              cartCountLocal = 0;
            }
            val["id"] = val.product_id;
            val["color"] = ["#5C6BC0", "#66BB6A", "#90A4AE"];
            val["availibilityCount"] = 5;
            val["cartCount"] = cartCountLocal;
            val["description"] = val.Romantic_Copy_Short;
            val["discount"] = null;
            val["name"] = val.product;
            val["newPrice"] = val.price;
            val["oldPrice"] = null;
            val["ratingsCount"] = 3;
            val["ratingsValue"] = 4;
            val["size"] = val.size;
            val["weight"] = null;
            val["brand"] = val.brand;
            val["storeid"] = val.store_id;
            val["sub_type"] = val.subtype;
            val["thumbnailurl"] = val.image_url;
            val["clickValue"] = "Product + products_by_customer_viewed";
            (val["dept"] = val.dept), (val["user_recommendation_id"] = 3);
            val["recommendation_type_id"] = 3;
            val["pageName"] = "Product Page";
            val["recommendation_type"] = "products_by_customer_viewed";
            (val["query"] = query),
              (val["images"] = [
                {
                  big: "https://www.mastgeneralstore.com/" + val.image_url,
                  small: "https://www.mastgeneralstore.com/" + val.image_url,
                  medium: "https://www.mastgeneralstore.com/" + val.image_url,
                },
              ]);
          });
          this.alsoBuyProducts = demo;
        }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  public getRelatedProducts(id) {
    this.http
      .get<any>(
        "http://127.0.0.1:8000/rec/"+this.clickService.getOrgId()+"/similar_products/" +
          id +
          "/" +
          this.clickService.getUser() +
          "/" +
          this.pageNumber +
          "/" +
          "100"
      )
      .subscribe({
        next: (data) => {
          // console.log(data)

          let query = this.currentProductSearchValue.query;
          let demo;
          demo = data.dataset.products;
          if(demo){
          demo.forEach((val) => {
            let cartCountLocal;

            if (
              this.appService.Data.cartList.filter(
                (item) => item.id == val.product_id
              )[0]
            ) {
              let item = this.appService.Data.cartList.filter(
                (item) => item.id == val.product_id
              )[0];
              cartCountLocal = item.cartCount;
            } else {
              cartCountLocal = 0;
            }
            val["id"] = val.product_id;
            val["color"] = ["#5C6BC0", "#66BB6A", "#90A4AE"];
            val["availibilityCount"] = 5;
            val["cartCount"] = cartCountLocal;
            val["description"] = val.Romantic_Copy_Short;
            val["discount"] = null;
            val["name"] = val.product;
            val["newPrice"] = val.price;
            val["oldPrice"] = null;
            val["ratingsCount"] = 3;
            val["ratingsValue"] = 4;
            val["size"] = val.size;
            val["weight"] = null;
            val["brand"] = val.brand;
            val["storeid"] = val.store_id;
            val["sub_type"] = val.subtype;
            val["thumbnailurl"] = val.image_url;
            val["clickValue"] = "Product + similar_products";
            (val["dept"] = val.dept), (val["user_recommendation_id"] = 1);
            val["recommendation_type_id"] = 1;
            val["pageName"] = "Product Page";
            val["recommendation_type"] = "similar_products";
            val["query"] = query;
            val["images"] = [
              {
                big: "https://www.mastgeneralstore.com/" + val.image_url,
                small: "https://www.mastgeneralstore.com/" + val.image_url,
                medium: "https://www.mastgeneralstore.com/" + val.image_url,
              },
            ];
          });
          this.newRelatedProducts = demo;
        }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  public recommendMoreItem() {
    this.http
      .get<any>(
        "http://127.0.0.1:8000/rec/"+this.clickService.getOrgId()+"/recommend_more_products/" +
          this.clickService.getUser() +
          "/" +
          "1" +
          "/" +
          "100"
      )
      .subscribe({
        next: (data) => {
          // console.log(data)

          let demo;
          demo = data.dataset.products;
          if(demo){
          demo.forEach((val) => {
            let cartCountLocal;

            if (
              this.appService.Data.cartList.filter(
                (item) => item.id == val.product_id
              )[0]
            ) {
              let item = this.appService.Data.cartList.filter(
                (item) => item.id == val.product_id
              )[0];
              cartCountLocal = item.cartCount;
            } else {
              cartCountLocal = 0;
            }
            val["id"] = val.product_id;
            val["color"] = ["#5C6BC0", "#66BB6A", "#90A4AE"];
            val["availibilityCount"] = 5;
            val["cartCount"] = cartCountLocal;
            val["description"] = val.Romantic_Copy_Short;
            val["discount"] = null;
            val["name"] = val.product;
            val["newPrice"] = val.price;
            val["oldPrice"] = null;
            val["ratingsCount"] = 3;
            val["ratingsValue"] = 4;
            val["size"] = val.size;
            val["weight"] = null;
            val["brand"] = val.brand;
            val["storeid"] = val.store_id;
            val["sub_type"] = val.subtype;
            val["thumbnailurl"] = val.image_url;
            val["clickValue"] = "Home + recommend_more_products";
            (val["dept"] = val.dept), (val["user_recommendation_id"] = 5);
            val["recommendation_type_id"] = 5;
            val["pageName"] = "Home Page";
            val["recommendation_type"] = "recommend_more_products";
            (val["query"] = ""),
              (val["images"] = [
                {
                  big: "https://www.mastgeneralstore.com/" + val.image_url,
                  small: "https://www.mastgeneralstore.com/" + val.image_url,
                  medium: "https://www.mastgeneralstore.com/" + val.image_url,
                },
              ]);
          });
          this.recommendMoreProducts = demo;
        }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
