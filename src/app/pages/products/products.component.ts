import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  ChangeDetectorRef,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { ProductDialogComponent } from "../../shared/products-carousel/product-dialog/product-dialog.component";
import { AppService } from "../../app.service";
import { Product, Category } from "../../app.models";
import { Settings, AppSettings } from "src/app/app.settings";
import { HttpClient } from "@angular/common/http";
import { ClickStreamService } from "src/app/shared/services/click-stream.service";
import { TimeAndVisitsTrackerService } from "src/app/shared/services/time-and-visits-tracker.service";
import { J } from "@angular/cdk/keycodes";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent implements OnInit {
  @ViewChild("sidenav", { static: true }) sidenav: any;
  public sidenavOpen: boolean = true;
  private sub: any;
  public viewType: string = "grid";
  public viewCol: number = 25;
  public counts = [100, 200, 300, 400, 500];
  public count: any;
  public sortings = [
    "Sort by Default",
    "Best match",
    "Lowest first",
    "Highest first",
  ];
  public sort: any;
  public products: Array<Product> = [];
  public categories: Category[];
  public brandsNew: Category[];
  public brands = [];
  public priceFrom: number = 0;
  public priceTo: number = 0;
  public colors = [
    { name: "#5C6BC0", selected: false },
    { name: "#66BB6A", selected: false },
    { name: "#EF5350", selected: false },
    { name: "#BA68C8", selected: false },
    { name: "#FF4081", selected: false },
    { name: "#9575CD", selected: false },
    { name: "#90CAF9", selected: false },
    { name: "#B2DFDB", selected: false },
    { name: "#DCE775", selected: false },
    { name: "#FFD740", selected: false },
    { name: "#00E676", selected: false },
    { name: "#FBC02D", selected: false },
    { name: "#FF7043", selected: false },
    { name: "#F5F5F5", selected: false },
    { name: "#696969", selected: false },
  ];
  public sizes = [
    // { name: "S", selected: false },
    // { name: "M", selected: false },
    // { name: "L", selected: false },
    // { name: "XL", selected: false },
    // { name: "2XL", selected: false },
    // { name: "32", selected: false },
    // { name: "36", selected: false },
    // { name: "38", selected: false },
    // { name: "46", selected: false },
    // { name: "52", selected: false },
    // { name: "13.3\"", selected: false },
    // { name: "15.4\"", selected: false },
    // { name: "17\"", selected: false },
    // { name: "21\"", selected: false },
    // { name: "23.4\"", selected: false }
  ];
  public page: any;
  public settings: Settings;
  categoryName: any;
  final: any;

  keywordList: any = [];
  selectedKeyword;
  searchResult;
  isFromSearch: boolean = false;
  searchedProducts: any = [];
  minPrice = 0;
  maxPrice = 0;
  pageNumber = 1;
  pageSizeNew = 100;
  searchQuery;
  totalProducts;

  requestBody = {
    query: "",
    brand: [],
    dept: [],
    type: [],
    subtype: [],
    sorting_label: "",
  };

  keywordByquerySearch;
  keybyQueryParam;
  constructor(
    public appSettings: AppSettings,
    private activatedRoute: ActivatedRoute,
    public appService: AppService,
    public dialog: MatDialog,
    private clickService: ClickStreamService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private http: HttpClient,
    private timeAndVisitTracker: TimeAndVisitsTrackerService,
    private loader: NgxSpinnerService
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.count = this.counts[0];
    this.requestBody = {
      query: "",
      brand: [],
      dept: [],
      type: [],
      subtype: [],
      sorting_label: "",
    };

    this.keywordByquerySearch =
      this.activatedRoute.snapshot.paramMap.get("selectedKeyword");
    this.keybyQueryParam = this.activatedRoute.snapshot.paramMap.get("key");
    this.getProductsList(
      this.activatedRoute.snapshot.paramMap.get("keyword").toLowerCase(),
      this.activatedRoute.snapshot.paramMap.get("key"),
      this.activatedRoute.snapshot.paramMap.get("value").toLowerCase(),
      this.activatedRoute.snapshot.paramMap.get("selectedKeyword")
    );

    this.timeAndVisitTracker.startTracking();
    this.clickService.catClickedEvent.subscribe((name: string) => {
      console.log(name);

      this.requestBody = {
        query: "",
        brand: [],
        dept: [],
        type: [],
        subtype: [],
        sorting_label: "",
      };

      let data = JSON.parse(name);
      this.getProductsList(
        data.keyword.toLowerCase(),
        data.key,
        data.value.toLowerCase(),
        data.selectedKeyword
      );
      this.keywordByquerySearch = data.selectedKeyword;
      this.keybyQueryParam = data.key;
 
    });

    this.sort = this.sortings[0];
 
    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
    }
    if (window.innerWidth < 1280) {
      this.viewCol = 33.3;
    }

    this.getBrands();
    // this.getAllProducts();
  }

  getProductsList(keyword, key, value, selectedKeyword) {
    console.log(this.count);

    this.requestBody.query = keyword;
    if (key == "dept") {
      this.requestBody.dept.push(value);
    }
    if (key == "type") {
      this.requestBody.type.push(value);
    }
    if (key == "brand") {
      this.requestBody.brand.push(value);
    }
    this.loader.show();
    this.http
      .post<any>(
        "http://127.0.0.1:8000/console/" +
          this.clickService.getOrgId() +
          "/site_search/site_setting/" +
          this.clickService.getUser() +
          "/" +
          this.pageNumber +
          "/" +
          this.count,
        { response: this.requestBody }
      )
      .subscribe({
        next: (data) => {
          this.keywordList = [];
          this.searchResult = [];
          this.loader.hide();
          if (selectedKeyword == "undefined" || selectedKeyword == "") {
            this.searchResult = data.dataset;
          } else {
            if (key == "keywordSuggetion") {
              this.searchResult = data.dataset;
              this.searchResult.forEach((element) => {
                this.keywordList.push(element.keyword);
              });
              this.selectedKeyword = this.searchResult[0].keyword;
            } else {
              let filteredProduct = data.dataset.filter(
                (item) => item.keyword == selectedKeyword
              );
              this.searchResult = filteredProduct;
              this.searchResult.forEach((element) => {
                this.keywordList.push(element.keyword);
              });
              this.selectedKeyword = selectedKeyword;
            }
          }

          this.selectProductsByKeyword(this.selectedKeyword);
        },
        error: (error) => {
          this.loader.hide();
          console.log(error);
        },
      });
  }

  updateProductTrack(id) {
    console.log(id);
    

    
    if (this.requestBody.query !='') {
      console.log(this.requestBody.query);
      this.clickService.updateProductTrack("product", id);
      this.clickService.updateProductTrack("from", "search + enter2");
      this.clickService.updateProductTrack("lastscreen", "products");
      this.clickService.updateProductTrack("currentScreen", "product");
      this.clickService.updateProductTrack("query", this.requestBody.query);
    } else {
      this.clickService.updateProductTrack("product", id);
      this.clickService.updateProductTrack("lastscreen", "products");
      this.clickService.updateProductTrack("currentScreen", "product");
      this.clickService.updateProductTrack("from", "search + enter3");
      this.clickService.updateProductTrack("query",'');
    }
  }

 

  selectKeywordUI(keyword) {
    this.pageNumber = 1;
    this.selectProductsByKeyword(keyword);
  }

  selectProductsByKeyword(keyword) {
    console.log(this.requestBody.query);
    
    this.selectedKeyword = keyword;
    let filteredProduct = this.searchResult.filter(
      (item) => item.keyword == keyword
    )[0];

    this.sizes = [];
    if (filteredProduct.filter) {
      if (filteredProduct.filter.size.length) {
        filteredProduct.filter.size.forEach((element) => {
          this.sizes.push({ name: element, selected: false });
        });
      }
      if (filteredProduct.filter.price_range.length) {
        let firstStringArray = filteredProduct.filter.price_range[0].split("-");
        let lastStringArray =
          filteredProduct.filter.price_range[
            filteredProduct.filter.price_range.length - 1
          ].split("-");
        this.minPrice = firstStringArray[0].trim();
        this.maxPrice = lastStringArray[1].trim();
        this.priceFrom = 0;
        this.priceTo = this.maxPrice;
      }
    }

    let demo;
    demo = filteredProduct.products;
    this.totalProducts = filteredProduct.total_product;
    if (demo) {
      demo.forEach((val) => {
        val["id"] = val.product_id;
        val["color"] = ["#5C6BC0", "#66BB6A", "#90A4AE"];
        val["availibilityCount"] = 5;
        val["cartCount"] = 0;
        val["description"] =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut congue eleifend nulla vel rutrum. Donec tempus metus non erat vehicula, vel hendrerit sem interdum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.";
        val["discount"] = null;
        val["name"] = val.product;
        val["newPrice"] = val.price;
        val["oldPrice"] = null;
        val["ratingsCount"] = 3;
        val["ratingsValue"] = 4;
        val["size"] = val.size;
        val["weight"] = null;
        val["brand"] = val.brand;
        val["storeid"] = val.storeid;
        val["sub_type"] = val.sub_type;
        val["thumbnailurl"] = val.image_url;
        val["dept"] = val.dept;
        val["query"] = this.requestBody.query;
        val["images"] = [
          {
            small: "https://www.mastgeneralstore.com/" + val.image_url,
            medium: "https://www.mastgeneralstore.com/" + val.image_url,
            big: "https://www.mastgeneralstore.com/" + val.image_url,
          },
          {
            small: "https://www.mastgeneralstore.com/" + val.image_url,
            medium: "https://www.mastgeneralstore.com/" + val.image_url,
            big: "https://www.mastgeneralstore.com/" + val.image_url,
          },
          {
            small: "https://www.mastgeneralstore.com/" + val.image_url,
            medium: "https://www.mastgeneralstore.com/" + val.image_url,
            big: "https://www.mastgeneralstore.com/" + val.image_url,
          },
        ];
      });
      const arrayUniqueByKey: any = [
        ...new Map(demo.map((item) => [item["id"], item])).values(),
      ];
console.log(arrayUniqueByKey);

      let deptArray = [];
      let brandsArray = [];
      setTimeout(() => {
        arrayUniqueByKey.forEach((element) => {
          deptArray.push(element.dept);
          brandsArray.push(element.brand);
        });
        let filterArray = [...new Set(deptArray)];
        let brandFilterArray = [...new Set(brandsArray)];

        this.categories = [];
        let myCat = [];
        filterArray.forEach((element, i) => {
          myCat.push({
            hasSubCategory: false,
            id: i + 1,
            name: element,
            parentId: 0,
          });
        });
        let AllCatText = {
          hasSubCategory: false,
          id: 0,
          name: "All",
          parentId: 0,
        };
        myCat.splice(0, 0, AllCatText);
        this.categories = myCat;
        this.cd.detectChanges();

        this.brandsNew = [];
        let myCat1 = [];
        brandFilterArray.forEach((element, i) => {
          myCat1.push({
            hasSubCategory: false,
            id: i + 1,
            name: element,
            parentId: 0,
          });
        });
        let AllCatText1 = {
          hasSubCategory: false,
          id: 0,
          name: "All",
          parentId: 0,
        };
        myCat1.splice(0, 0, AllCatText1);
        this.brandsNew = myCat1;
        this.cd.detectChanges();

        //push 123 to position 1

        // this.categories[0] = AllCatText;
        this.searchedProducts = [];
        this.searchedProducts = arrayUniqueByKey;
        this.filterBySearchCat("All");
      }, 500);
    }
  }

  filterBySearchCat(cat) {
    if (cat == "All") {
      this.products = this.searchedProducts;
    } else {
      let filterArray: any = [];
      this.searchedProducts.forEach((element) => {
        if (element.dept == cat.toLowerCase()) {
          filterArray.push(element);
        }
      });
      this.products = filterArray;
    }
  }
  filterBySearchBrand(brand) {
    if (brand == "All") {
      this.products = this.searchedProducts;
    } else {
      let filterArray: any = [];
      this.searchedProducts.forEach((element) => {
        if (element.brand == brand.toLowerCase()) {
          filterArray.push(element);
        }
      });
      this.products = filterArray;
    }
  }

  public getAllProducts() {
    this.appService.getProducts("featured").subscribe((data) => {
      this.products = data;
      //for show more product
      for (var index = 0; index < 3; index++) {
        this.products = this.products.concat(this.products);
      }
    });
  }
 

  public getCategories() {
    this.loader.show();
    this.http
      .get<any>(
        "http://127.0.0.1:8000/" + this.clickService.getOrgId() + "/categories"
      )
      .subscribe({
        next: (data) => {
          let myCat = [];
          data.dataset.forEach((element, i) => {
            myCat.push({
              hasSubCategory: false,
              id: i + 1,
              name: element,
              parentId: 0,
            });
          });
          let AllCatText = {
            hasSubCategory: false,
            id: 0,
            name: "All Categories",
            parentId: 0,
          };
          this.categories = myCat;
          this.categories[0] = AllCatText;
          this.loader.hide();

          // this.category = this.categories[0];
        },
        error: (error) => {
          this.loader.hide();
          console.log(error);
        },
      });
    // if(this.appService.Data.categories.length == 0) {
    //   this.appService.getCategories().subscribe(data => {
    //     this.categories = data;
    //     this.appService.Data.categories = data;
    //   });
    // }
    // else{
    //   this.categories = this.appService.Data.categories;
    // }
  }

  public getBrands() {
    this.brands = this.appService.getBrands();
    this.brands.forEach((brand) => {
      brand.selected = false;
    });
  }

  ngOnDestroy() {
    this.timeAndVisitTracker.stopTracking();
  }

  @HostListener("window:resize")
  public onWindowResize(): void {
    window.innerWidth < 960
      ? (this.sidenavOpen = false)
      : (this.sidenavOpen = true);
    window.innerWidth < 1280 ? (this.viewCol = 33.3) : (this.viewCol = 25);
  }

  public changeCount(count) {
    this.count = count;
    this.loader.show();
    this.http
      .post<any>(
        "http://127.0.0.1:8000/console" +
          this.clickService.getOrgId() +
          "/site_search/site_setting/" +
          this.clickService.getUser() +
          "/" +
          this.pageNumber +
          "/" +
          this.count,
        { response: this.requestBody }
      )
      .subscribe({
        next: (data) => {
          this.keywordList = [];
          this.searchResult = [];
          if (this.keybyQueryParam == "keywordSuggetion") {
            this.searchResult = data.dataset;
            this.searchResult.forEach((element) => {
              this.keywordList.push(element.keyword);
            });
            this.selectedKeyword = this.searchResult[0].keyword;
          } else {
            let filteredProduct = data.dataset.filter(
              (item) => item.keyword == this.keywordByquerySearch
            );
            this.searchResult = filteredProduct;
            this.searchResult.forEach((element) => {
              this.keywordList.push(element.keyword);
            });
            this.selectedKeyword = this.keywordByquerySearch;
          }

          // this.searchResult = data.dataset;
          // this.searchResult.forEach(element => {
          //   this.keywordList.push(element.keyword)
          // });

          this.loader.hide();
          this.selectProductsByKeyword(this.selectedKeyword);
        },
        error: (error) => {
          this.loader.hide();

          console.log(error);
        },
      });
    // if (this.isFromSearch) {
    //   this.getPeoductsBySearchPage(this.searchQuery);
    // } else {
    //   this.getProductsByCat(this.categoryName);
    // }
    window.scrollTo(0, 0);

    // this.getAllProducts();
  }

  public changeSorting(sort) {
    this.sort = sort;
  }

  public changeViewType(viewType, viewCol) {
    this.viewType = viewType;
    this.viewCol = viewCol;
  }

  public openProductDialog(product) {
    let dialogRef = this.dialog.open(ProductDialogComponent, {
      data: product,
      panelClass: "product-dialog",
      direction: this.settings.rtl ? "rtl" : "ltr",
    });
    dialogRef.afterClosed().subscribe((product) => {
      if (product) {
        this.router.navigate(["/products", "2", product.id]);
      }
    });
  }

  public onPageChanged(event) {
    this.pageNumber = event;
    this.loader.show();
    this.http
      .post<any>(
        "http://127.0.0.1:8000/console/" +
          this.clickService.getOrgId() +
          "/site_search/site_setting/" +
          this.clickService.getUser() +
          "/" +
          this.pageNumber +
          "/" +
          this.count,
        { response: this.requestBody }
      )
      .subscribe({
        next: (data) => {
          this.keywordList = [];
          this.searchResult = [];
          if (this.keybyQueryParam == "keywordSuggetion") {
            this.searchResult = data.dataset;
            this.searchResult.forEach((element) => {
              this.keywordList.push(element.keyword);
            });
            this.selectedKeyword = this.searchResult[0].keyword;
          } else {
            let filteredProduct = data.dataset.filter(
              (item) => item.keyword == this.keywordByquerySearch
            );
            this.searchResult = filteredProduct;
            this.searchResult.forEach((element) => {
              this.keywordList.push(element.keyword);
            });
            this.selectedKeyword = this.keywordByquerySearch;
          }

          this.loader.hide();
          this.selectProductsByKeyword(this.selectedKeyword);
        },
        error: (error) => {
          this.loader.hide();

          console.log(error);
        },
      });
    // if (this.isFromSearch) {
    //   this.getPeoductsBySearchPage(this.searchQuery);
    // } else {
    //   this.getProductsByCat(this.categoryName);
    // }
    window.scrollTo(0, 0);
  }

 

 
  filterByPrice() {
    let filteredProduct = [];
    this.searchedProducts.forEach((element) => {
      if (
        element.newPrice >= this.priceFrom &&
        element.newPrice <= this.priceTo
      ) {
        filteredProduct.push(element);
      }
    });
    this.products = filteredProduct;
  }
  filterBySize(size) {
    this.sizes.forEach((el) => {
      if (el.name == size.name) {
        el.selected = true;
      } else {
        el.selected = false;
      }
    });
    let filteredProduct = [];
    this.searchedProducts.forEach((element) => {
      if (element.size != null) {
        let splitSize = element.size.split(",");
        if (splitSize.includes(size.name)) {
          filteredProduct.push(element);
        }
      }
    });
    this.products = filteredProduct;
  }
}
