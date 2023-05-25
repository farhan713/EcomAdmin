import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Settings, AppSettings } from '../app.settings';
import { AppService } from '../app.service';
import { Category, Product } from '../app.models';
import { SidenavMenuService } from '../theme/components/sidenav-menu/sidenav-menu.service';
import { HttpClient } from "@angular/common/http";
import { MatMenuTrigger } from '@angular/material/menu';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ClickStreamService } from '../shared/services/click-stream.service';
import { clickData } from '../shared/services/click-model'
import { NgxSpinnerService } from 'ngx-spinner';


// import { EmitEventService } from '../shared/services/emit-event.service;
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  providers: [SidenavMenuService]
})
export class PagesComponent implements OnInit {
  public clickData: clickData;
  public showBackToTop: boolean = false;
  public categories: Category[];
  public category: Category;
  public sidenavMenuItems: Array<any>;
  @ViewChild('sidenav', { static: true }) sidenav: any;
  @ViewChild('searchC') searchElement: ElementRef;

  selecectedCatId = "1"
  selectedSubCatId = "1"
  finalCategoryList: any = [];
  BrandArray: any = [];
  deptArray: any = [];
  typeArray: any = [];
  listQuery;
  selectedMainCat;
  selectedDeptName;
  selectedType;
  selectedBrand;
  productArray;
  contentPlaceholder: MatMenuTrigger;
  priceFrom = 0;
  priceTo = 0;
  interValChecker;
  skulist: any = [];

  public currencies = [
    { name: 'SiteSearchBm25', url: 'http://127.0.0.1:8000/site_search/site_search_bm25' },
    { name: 'Popularity', url: 'http://localhost:5000/SiteSearch/Popularity' }
  ];
  public currency: any = "http://127.0.0.1:8000/sse/site_search/site_search_bm25/";

  @ViewChild("menuTrigger", { static: false }) set menuTrigger(
    content: MatMenuTrigger
  ) {
    if (content) {
      this.contentPlaceholder = content;
    }
  }
  mycategory: any = [
    {
      id: "1",
      name: "Men"
    },
    {
      id: "2",
      name: "Women"
    },
    {
      id: "3",
      name: "children"
    }

  ]
  mysubcategory: any = [
    {
      id: "1",
      name: "jeans",
      catId: "1"
    },
    {
      id: "2",
      name: "watches",
      catId: "1"
    },
    {
      id: "3",
      name: "shoes",
      catId: "1"
    },
    {
      id: "4",
      name: "Western-wear",
      catId: "2"
    },
    {
      id: "5",
      name: "Gold & Diamomd jewelley",
      catId: "2"
    },
    {
      id: "6",
      name: "Fashion sandals",
      catId: "2"
    },
    {
      id: "7",
      name: "Toys & games",
      catId: "3"
    },
    {
      id: "8",
      name: "Baby bath & grooming",
      catId: "3"
    },
    {
      id: "9",
      name: "Kid's Clothing",
      catId: "3"
    }
  ];
  myproduct: any = [
    {
      id: "1",
      name: "Lee Men Pants",
      imgUrl: "https://m.media-amazon.com/images/I/5106NB0RPgL._UX679_.jpg",
      catId: "1",
      subcatId: "1"
    },
    {
      id: "2",
      name: "Pepe Jeans Men's Slim Jeans",
      imgUrl: "https://m.media-amazon.com/images/I/61wb97at1cS._UX569_.jpg",
      catId: "1",
      subcatId: "1"
    },
    {
      id: "3",
      name: "Fossil Gen 5E",
      imgUrl: "https://m.media-amazon.com/images/I/71YcPlrli5L._UX466_.jpg",
      catId: "1",
      subcatId: "2"
    },
    {
      id: "4",
      name: "Fastrack Reflex Vybe Smart Watch",
      imgUrl: "https://m.media-amazon.com/images/I/615yAswN0oL._UX466_.jpg",
      catId: "1",
      subcatId: "2"
    },
    {
      id: "5",
      name: "Sparx Men's Canvas Sneakers",
      imgUrl: "https://m.media-amazon.com/images/I/61L4ZMMwgCL._UY625_.jpg",
      catId: "1",
      subcatId: "3"
    },
    {
      id: "6",
      name: "BATA Mens Mesh Mushy Casual",
      imgUrl: "https://m.media-amazon.com/images/I/61D5JyuojVL._UX625_.jpg",
      catId: "1",
      subcatId: "3"
    },
    {
      id: "7",
      name: "VERO MODA Women's Cotton Sweatshirt",
      imgUrl: "https://m.media-amazon.com/images/I/31GrAAXYdZL.jpg",
      catId: "2",
      subcatId: "4"
    },
    {
      id: "8",
      name: "Jealous 21 Women's Regular Fit Shirt",
      imgUrl: "https://m.media-amazon.com/images/I/91LtvLAEFZL._UX569_.jpg",
      catId: "2",
      subcatId: "4"
    },
    {
      id: "9",
      name: "Candere By Kalyan Jewellers",
      imgUrl: "https://m.media-amazon.com/images/I/412zntrizrL.jpg",
      catId: "2",
      subcatId: "5"
    },
    {
      id: "10",
      name: "PC Jeweller The Anichi",
      imgUrl: "https://m.media-amazon.com/images/I/71LBq0UkIsL._UY575_.jpg",
      catId: "2",
      subcatId: "5"
    },
    {
      id: "11",
      name: "CANVI-Synthetic Leather Sandals",
      imgUrl: "https://m.media-amazon.com/images/I/61ZLrNSnihL._UY695_.jpg",
      catId: "2",
      subcatId: "6"
    },
    {
      id: "12",
      name: "Myra Women's Shimmer Heel Sandal",
      imgUrl: "https://m.media-amazon.com/images/I/61yWgDvBOvL._UY625_.jpg",
      catId: "2",
      subcatId: "6"
    },
    {
      id: "13",
      name: "Jam & Honey Swing-Magic Car",
      imgUrl: "https://m.media-amazon.com/images/I/71R7ID8xiTL._SX450_.jpg",
      catId: "3",
      subcatId: "7"
    },
    {
      id: "14",
      name: "Jam & Honey Remote-Control Car",
      imgUrl: "https://m.media-amazon.com/images/I/71xKZ07lwML._SX450_.jpg",
      catId: "3",
      subcatId: "7"
    },
    {
      id: "15",
      name: "Johnson's Baby Care Collection",
      imgUrl: "https://m.media-amazon.com/images/I/81eq30Sv6HL._SX679_.jpg",
      catId: "3",
      subcatId: "8"
    },
    {
      id: "16",
      name: "BRANDONN Baby Blankets",
      imgUrl: "https://m.media-amazon.com/images/I/610blpPlB4L._SX679_PIbundle-2,TopRight,0,0_SX679SY614SH20_.jpg",
      catId: "3",
      subcatId: "8"
    },
    {
      id: "17",
      name: "Wish Karo Cotton Clothing Sets For Baby Boys",
      imgUrl: "https://m.media-amazon.com/images/I/51F-lv2DsLS._UX679_.jpg",
      catId: "3",
      subcatId: "9"
    },
    {
      id: "18",
      name: "Amazon Brand - Jam & Honey Girls Casual Dress",
      imgUrl: "https://m.media-amazon.com/images/I/81SlBsAMiJL._UY741_.jpg",
      catId: "3",
      subcatId: "9"
    }
  ];
  data: any = [
    { "index": 4005, "Recommeded_products": "LIFE PROTECTION FORMULA ADULT DRY DOG FO", "Brand": "BLUE BUFFALO", "Dept": "EQUINE PET", "Type": "DOGS", "Subtype_1": "FOOD", "Subtype_2": "", "Subtype_3": "", "Cosine_sim": 1.0 },
    { "index": 4006, "Recommeded_products": "ALL LIFE STAGES CANNED DOG FOOD", "Brand": "CANIDAE", "Dept": "EQUINE PET", "Type": "DOGS", "Subtype_1": "FOOD", "Subtype_2": "", "Subtype_3": "", "Cosine_sim": 1.0 },
    { "index": 4007, "Recommeded_products": "CANIDAE CAN LAMB RICE DOG 13OZ", "Brand": "CANIDAE", "Dept": "EQUINE PET", "Type": "DOGS", "Subtype_1": "FOOD", "Subtype_2": "", "Subtype_3": "", "Cosine_sim": 1.0 },
    { "index": 4008, "Recommeded_products": "GF CAN PURE ELEMENTS DOG 13OZ", "Brand": "CANIDAE", "Dept": "EQUINE PET", "Type": "DOGS", "Subtype_1": "FOOD", "Subtype_2": "", "Subtype_3": "", "Cosine_sim": 1.0 },
    { "index": 4009, "Recommeded_products": "GF CAN PURELAND LAMB DOG 13OZ", "Brand": "CANIDAE", "Dept": "EQUINE PET", "Type": "DOGS", "Subtype_1": "FOOD", "Subtype_2": "", "Subtype_3": "", "Cosine_sim": 1.0 },
    { "index": 4010, "Recommeded_products": "PURE SKY GF CANNED DOG FOOD", "Brand": "CANIDAE", "Dept": "EQUINE PET", "Type": "DOGS", "Subtype_1": "FOOD", "Subtype_2": "", "Subtype_3": "", "Cosine_sim": 1.0 },
    { "index": 4011, "Recommeded_products": "PURE FOUNDATIONS GRAIN-FREE CAN PUPPY FOOD", "Brand": "CANIDAE", "Dept": "EQUINE PET", "Type": "DOGS", "Subtype_1": "FOOD", "Subtype_2": "", "Subtype_3": "", "Cosine_sim": 1.0 },
    { "index": 4012, "Recommeded_products": "ALL LIFE STAGES DOG FOOD", "Brand": "CANIDAE", "Dept": "EQUINE PET", "Type": "DOGS", "Subtype_1": "FOOD", "Subtype_2": "", "Subtype_3": "", "Cosine_sim": 0.8803710938 },
    { "index": 4013, "Recommeded_products": "CLASSIC MATURE CARE DRY DOG FOOD", "Brand": "CHICKEN SOUP", "Dept": "EQUINE PET", "Type": "DOGS", "Subtype_1": "FOOD", "Subtype_2": "", "Subtype_3": "", "Cosine_sim": 0.8803710938 },
    {
      "index": 4014, "Recommeded_products": "CLASSIC MATURE CANNED DOG FOOD", "Brand": "CHICKEN SOUP", "Dept": "EQUINE PET",
      "Type": "DOGS", "Subtype_1": "FOOD", "Subtype_2": "", "Subtype_3": "", "Cosine_sim": 0.8803710938
    }]

  serverRes
  menuContent = false

  selectedSubCatArray: any = [];
  selectedProducts: any = [];
  filerArray: any = [];
  mainRes;
  public settings: Settings;
  seeResultFor: any = [];
  currentTime = new Date();
  pageNumber = "1";
  sseCallTimer = 0;
  searchedQuery: any = '';
  totalProduct: any = 0;


  searchedQueryNew: any = '';

  requestBody = {
    query: "",
    brand: [],
    dept: [],
    type: [],
    subtype: [],
    sorting_label: ""
  }

  searchedProductList: any = [];
  brandListNew: any = [];
  deptListNew: any = [];
  typeListNew: any = [];
  subTypeListNew: any = [];

  serverResNew: any;
  selectedKeyword: any
  keyWordTobeSend: any = '';
  localRes: any;

  constructor(public appSettings: AppSettings,
    public appService: AppService,
    public sidenavMenuService: SidenavMenuService,
    private http: HttpClient,
    public router: Router, private overlayContainer: OverlayContainer,
    private clickService: ClickStreamService , private spinner: NgxSpinnerService,) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.skulist = [];
    this.selectedSubCatArray = this.mysubcategory.filter(i => "1" == i.catId);
    this.selectedProducts = this.myproduct.filter(i => "1" == i.subcatId);

    this.getCategories();
    this.sidenavMenuItems = this.sidenavMenuService.getSidenavMenuItems();
  }
  closeMenu() {
    this.contentPlaceholder.closeMenu();
    // this.updateVisitedSkulist();
  }
  selectMain(mainName) {
    this.deptArray = [];
    this.selectedMainCat = mainName;

    this.mainRes.forEach(element => {
      if (element.keyword == mainName) {
        this.filerArray = element.filter;
        this.finalCategoryList = element.products;



      }
    });
    setTimeout(() => {
      this.finalCategoryList.forEach(el => {
        this.deptArray.push({ name: el.dept });
      });
      this.deptArray = this.getUniqueListBy(this.deptArray, 'name');
      this.selectDepartment(this.deptArray[0].name);
    }, 100);

    this.contentPlaceholder.openMenu();
    setTimeout(() => { // this will make the execution after the above boolean has changed
      this.searchElement.nativeElement.focus();
    }, 0);
  }
  preventCloseOnClickOut() {

    this.overlayContainer.getContainerElement().classList.add('disable-backdrop-click');
  }

  allowCloseOnClickOut() {
    this.overlayContainer.getContainerElement().classList.remove('disable-backdrop-click');
  }

  selectDepartment(deptName) {


    this.selectedDeptName = deptName;

    this.typeArray = this.finalCategoryList.filter(i => deptName == i.dept);

    this.clickService.sendMessage({ "event": "hover", "eventType": "SEARCHED_RESULT_DEPT_CLICKED", "dept": deptName });

    this.typeArray = this.getUniqueListBy(this.typeArray, 'type');
    this.typeArray = this.getValidArray(this.typeArray, 'type');
    if (this.typeArray.length) {
      this.selectType(this.typeArray[0].type)
    } else {
      let brndArray = this.finalCategoryList.filter(i => this.selectedDeptName == i.dept);
      this.BrandArray = brndArray.filter(i => deptName == i.dept);
      this.BrandArray = this.getUniqueListBy(this.BrandArray, 'brand');
      this.selectBrand(this.BrandArray[0].brand)
    }



  }
  selectType(type) {
    this.clickService.sendMessage({ "event": "hover", "eventType": "SEARCHED_RESULT_DEPT_CLICKED", "type": type });
    this.selectedType = type;
    let brndArray = this.finalCategoryList.filter(i => this.selectedDeptName == i.dept);
    this.BrandArray = brndArray.filter(i => type == i.type);
    this.BrandArray = this.getUniqueListBy(this.BrandArray, 'brand');
    this.selectBrand(this.BrandArray[0].brand)
  }
  selectBrand(brand) {
    this.selectedBrand = brand;
    let mainUrl = 'https://www.mastgeneralstore.com/';
    this.clickService.sendMessage({ "event": "hover", "eventType": "SEARCHED_RESULT_DEPT_CLICKED", "brand": brand });
    this.productArray = this.finalCategoryList.filter(i => this.selectedDeptName == i.dept);
    this.productArray = this.productArray.filter(i => brand == i.brand);
    if (this.typeArray.length) {
      this.productArray = this.productArray.filter(i => this.selectedType == i.type);
    }


    this.productArray.forEach((val) => {
      this.skulist.push(val.product_id);
      val.imgUrl = mainUrl + val.image_url;
      val.images = [
        {
          "small": 'https://www.mastgeneralstore.com/' + val.image_url,
          "medium": 'https://www.mastgeneralstore.com/' + val.image_url,
          "big": 'https://www.mastgeneralstore.com/' + val.image_url,
        },
      ]
    })
    setTimeout(() => {
      this.skulist = [... new Set(this.skulist)]
    }, 1000);
  }
  selectProduct(id) {
    this.selectedSubCatId = id
    this.selectedProducts = this.myproduct.filter(i => id == i.subcatId);
  }
  selectSearchOpetion(Query) {
    this.finalCategoryList.forEach((val) => {
      for (var key in val) {
        if (val[key] == Query) {
          this.selectDepartment(val.DEPT);
          break;
        }
      }

    });
  }
  shiftposition(e, column, name) {
    if (column == "dept") {
      this.selectDepartment(name)
    } else if (column == "type") {
      this.selectType(name)
    } else if (column == "brand") {
      this.selectBrand(name)
    }
  }
  clickinside(e) {
    if (this.searchedQuery.length >= 3 && this.serverRes) {
      setTimeout(() => {
        if(!this.contentPlaceholder.menuOpen) {          
          this.contentPlaceholder.openMenu();
          this.searchElement.nativeElement.focus();
        }
     
      }, 500);
    }
  }

  demoNew(e) {
    this.totalProduct = 0;
    this.searchedQuery = '';
    this.searchedQuery = e.target.value;
    if (this.interValChecker) {
      this.sseCallTimer = 0;
      clearInterval(this.interValChecker)
    }

    if (e.target.value.length >= 3) {
      this.interValChecker = setInterval(() => {
        this.sseCallTimer++;
        if (this.sseCallTimer >= 1) {
          if (e.keyCode == 13) {
            this.updateVisitedSkulist();
            clearInterval(this.interValChecker)
            this.clickService.updateProductTrack("from", "search + enter1");
            this.clickService.updateProductTrack("lastscreen", "home");
            this.clickService.updateProductTrack("currentScreen", "products");
            this.clickService.updateProductTrack("query", this.searchedQuery);
            // this.goToCatBySearch(e.target.value);

            let obj = {
              keyword: e.target.value,
              key: 'keywordSuggetion',
              value: '',
              selectedKeyword : this.selectedMainCat
            }
            let currentURL = this.router.url;
            let splitURL = currentURL.split(";");
            let currentRoute = splitURL[0];
            this.contentPlaceholder.closeMenu();
            if (currentRoute == '/products') {
              this.clickService.catClick(JSON.stringify(obj));
              this.router.navigate(['/products', obj]);
            } else {
              this.router.navigate(['/products', obj]);
            }

          } else {
            clearInterval(this.interValChecker)
            this.clickService.sendMessage({ "event": "keyup", "eventType": "SEARCHED_KEYWORD" });
            // this.spinner.show()
            this.http.post<any>('http://127.0.0.1:8000/sse/'+this.clickService.getOrgId()+'/site_search/site_search_bm25/'+this.clickService.getUser() + '/' + this.pageNumber + '/' + '100', { query: e.target.value }).subscribe({
              next: data => {
                // this.spinner.hide()
                if(data.dataset != null) {
                  this.totalProduct = data.dataset.reduce((total, obj) => obj.total_product + total, 0);
                  this.clickService.userVisit(this.clickService.getSessionId(), 0, "true", "false");
                  this.mainRes = [];
                  this.finalCategoryList = [];
                  this.mainRes = data.dataset;
  
                  let myArray1: any = [];
                  this.seeResultFor = [];
                  data.dataset.forEach(element => {
                    this.seeResultFor.push({ name: element.keyword });
                    element.products.forEach(el => {
                      myArray1.push(el)
                    });
                  });
                  this.serverRes = myArray1
                  this.selectMain(this.seeResultFor[0].name);
                } else {
                  this.totalProduct = 0;
                }
                this.updateVisitedSkulist();

           
                
              },
              error: error => {
                console.log(error);
                // this.spinner.hide()
              }
            })
          }
        }

      }, 1000);



    } else {
      this.contentPlaceholder.closeMenu();
    }
  }



  filterFromArray(key, value) {
    this.mainRes.forEach(element => {
      if (element.keyword == this.selectedMainCat) {
        this.filerArray = element.filter;
        this.finalCategoryList = element.products;
      }
    });
    setTimeout(() => {
      this.finalCategoryList.forEach(el => {
        this.deptArray.push({ name: el.dept });
      });
      this.deptArray = this.getUniqueListBy(this.deptArray, 'name');
      this.selectDepartment(this.deptArray[0].name);
    }, 100);


    setTimeout(() => {
      if (key == 'color') {
        this.clickService.sendMessage({ "event": "hover", "eventType": "SEARCHED_RESULT_COLOR_FILTER_CLICKED" });
        let filteredProduct = [];
        this.finalCategoryList.forEach(element => {
          if (element.color != null) {
            let splitSize = element.color.split(",");
            if (splitSize.includes(value)) {
              filteredProduct.push(element)
            }
          }
        });
        this.finalCategoryList = filteredProduct;

        // this.finalCategoryList = this.finalCategoryList.filter(prod => prod.color.includes(value));
        this.finalCategoryList.forEach(el => {
          this.deptArray.push({ name: el.dept });
        });
        this.deptArray = this.getUniqueListBy(this.deptArray, 'dept');
        this.selectDepartment(this.deptArray[0].name);
        // this.contentPlaceholder.openMenu();
      } else if (key == 'price_range') {

        let rangeArray = value.split("-");
        this.clickService.sendMessage({ "event": "hover", "eventType": "SEARCHED_RESULT_PRICE_FILTER_CLICKED" });
        this.finalCategoryList = this.finalCategoryList.filter(prod => (prod.price >= rangeArray[0].trim() && prod.price <= rangeArray[1]));
        this.finalCategoryList.forEach(el => {
          this.deptArray.push({ name: el.dept });
        });
        this.deptArray = this.getUniqueListBy(this.deptArray, 'dept');
        this.selectDepartment(this.deptArray[0].name);
      } else if (key == 'size') {
        this.clickService.sendMessage({ "event": "hover", "eventType": "SEARCHED_RESULT_SIZE_CLICKED" });

        let filteredProduct = [];
        this.finalCategoryList.forEach(element => {
          if (element.size != null) {
            let splitSize = element.size.split(",");
            if (splitSize.includes(value)) {
              filteredProduct.push(element)
            }
          }
        });
        this.finalCategoryList = filteredProduct;
        this.finalCategoryList.forEach(el => {
          this.deptArray.push({ name: el.dept });
        });
        this.deptArray = this.getUniqueListBy(this.deptArray, 'dept');
        this.selectDepartment(this.deptArray[0].name);
      }
    }, 500);

  }
  updateVisitedSkulist() {
    let data = {
      status: "Success",
      message: "User created successfully.",
      status_code: 200,
      data_tables: [
        {
          table_name: "tb_user_search_result",
          data: {
            session_id: this.clickService.getSessionId(),
            org_id: this.clickService.getOrgId(),
            store_id: -1,
            user_id: this.clickService.getUser(),
            search_query: this.searchedQuery,
            returned_sku_id_list: this.skulist,
            total_product: this.totalProduct
          }
        }
      ]
    }

    if (this.searchedQuery != '' && this.searchedQuery.length >= 3) {
      this.http.post<any>('http://127.0.0.1:8000/console/user_search_result', { response: data }).subscribe({
        next: data => {
          this.skulist = [];
        },
        error: error => {
        }
      })
    }

  }

  openProduct(name) {
    this.contentPlaceholder.closeMenu();
    // this.updateVisitedSkulist();
    let currentURL = this.router.url;
    let splitURL = currentURL.split("/");
    let currentRoute = splitURL[1];
    if (currentRoute == 'products') {
      this.clickService.sendMessage({ "event": "click", "eventType": "SEARCHED_PRODUCT_VIEW", "productName": name, query: this.searchedQuery });
      this.clickService.updateProductTrack("product", name);
      this.clickService.updateProductTrack("from", "search + click");
      this.clickService.updateProductTrack("lastscreen", "products");
      this.clickService.updateProductTrack("currentScreen", "products");
      this.clickService.updateProductTrack("query", this.searchedQuery);
      this.clickService.AClicked(name)
    } else {
      this.clickService.sendMessage({ "event": "click", "eventType": "SEARCHED_PRODUCT_VIEW", "productName": name });
      this.clickService.updateProductTrack("product", name);
      this.clickService.updateProductTrack("from", "search + click");
      this.clickService.updateProductTrack("lastscreen", "home");
      this.clickService.updateProductTrack("currentScreen", "products");
      this.clickService.updateProductTrack("query", this.searchedQuery);
      this.router.navigate(['/products', "2", name]);
    }

  }

  objectKeys(obj) {
    return Object.keys(obj);
  }

  public getCategories() {
    this.http.get<any>('http://127.0.0.1:8000/'+this.clickService.getOrgId()+'/categories').subscribe({
      next: data => {
        let myCat = []
        data.dataset.forEach((element, i) => {
          myCat.push({
            hasSubCategory: false,
            id: i + 1,
            name: element,
            parentId: 0
          })
        });
        let AllCatText = {
          hasSubCategory: false,
          id: 0,
          name: "All Categories",
          parentId: 0
        }
        this.categories = myCat;
        this.categories[0] = AllCatText;
        this.category = this.categories[0];
      },
      error: error => {
        console.log(error);

      }
    })
  }

  getValidArray(arr, key) {
    let myArray = []
    arr.forEach(element => {
      if (element[key] != 'nan') {
        myArray.push(element);
      }
    });
    return myArray;
  }

  getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }

  public changeCategory(event) {    
    let obj = {
      keyword: '',
      key: 'dept',
      value: event.target.innerText,
      selectedKeyword : ''
    }
    let currentURL = this.router.url;
    let splitURL = currentURL.split(";");
    let currentRoute = splitURL[0];
    if (currentRoute == '/products') {
      this.clickService.catClick(JSON.stringify(obj));
      this.router.navigate(['/products', obj]);
    } else {
      this.router.navigate(['/products', obj]);
    }
  }

  goToCatBySearch(catName) {    
    this.contentPlaceholder.closeMenu();
    // this.updateVisitedSkulist();
    let obj = {
      keyword: '',
      key: 'dept',
      value: catName,
      selectedKeyword : ''
    }


    let currentURL = this.router.url;

    let splitURL = currentURL.split(";");
    let currentRoute = splitURL[0];


    if (currentRoute == '/products') {
      this.clickService.catClick(JSON.stringify(obj));
      this.router.navigate(['/products', obj]);
    } else {
      this.router.navigate(['/products', obj]);
    }
  }



  public remove(product) {
    const index: number = this.appService.Data.cartList.indexOf(product);
    if (index !== -1) {
      this.appService.Data.cartList.splice(index, 1);
      this.appService.Data.totalPrice = this.appService.Data.totalPrice - product.newPrice * product.cartCount;
      this.appService.Data.totalCartCount = this.appService.Data.totalCartCount - product.cartCount;
      this.appService.resetProductCartCount(product);
    }
  }

  public clear() {
    this.appService.Data.cartList.forEach(product => {
      this.appService.resetProductCartCount(product);
    });
    this.appService.Data.cartList.length = 0;
    this.appService.Data.totalPrice = 0;
    this.appService.Data.totalCartCount = 0;
  }


  public changeTheme(theme) {
    this.settings.theme = theme;
  }

  public stopClickPropagate(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }

  public search() { }


  public scrollToTop() {
    var scrollDuration = 200;
    var scrollStep = -window.pageYOffset / (scrollDuration / 20);
    var scrollInterval = setInterval(() => {
      if (window.pageYOffset != 0) {
        window.scrollBy(0, scrollStep);
      }
      else {
        clearInterval(scrollInterval);
      }
    }, 10);
    if (window.innerWidth <= 768) {
      setTimeout(() => { window.scrollTo(0, 0) });
    }
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    ($event.target.documentElement.scrollTop > 300) ? this.showBackToTop = true : this.showBackToTop = false;
  }

  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.sidenav.close();
      }
    });
    this.sidenavMenuService.expandActiveSubMenu(this.sidenavMenuService.getSidenavMenuItems());
  }

  public closeSubMenus() {
    // this.updateVisitedSkulist();
    if (window.innerWidth < 960) {
      this.sidenavMenuService.closeAllSubMenus();
    }
  }
  onConnect() {
    // let data = {   "brand": "111",   "contentId": "string",   "dept": "string",   "event": "string",   "eventTime": "2023-01-27T09:00:55.697Z",   "eventType": "ADD_TO_LIST",   "genderType": "FEMALE",   "location": "string",   "productName": "string",   "sessionId": "string",   "styleId": "string",   "subType": "string",   "type": "string",   "userAgeStage": "ADULT",   "userId": "string" }
    // this.clickService.sendMessage(JSON.stringify(data) );
  }


  filterByKeyword(keyword) {
    this.serverResNew.forEach(element => {
      if (element.keyword == keyword) {
        this.localRes = element
      }
    });

    this.brandListNew = this.localRes.category_filter.brand
    this.deptListNew = this.localRes.category_filter.dept
    this.typeListNew = this.localRes.category_filter.type
    this.subTypeListNew = this.localRes.category_filter.subtype
  }

  onClickOfatt(key, value) {
    let obj = {
      keyword: this.searchedQuery,
      key: key,
      value: value,
      selectedKeyword : this.selectedMainCat
    }
console.log(obj);

    let currentURL = this.router.url;
    let splitURL = currentURL.split(";");
    let currentRoute = splitURL[0];
    this.contentPlaceholder.closeMenu();

    if (currentRoute == '/products') {
      this.clickService.catClick(JSON.stringify(obj));
      this.router.navigate(['/products', obj]);
    } else {
      this.router.navigate(['/products', obj]);
    }
  }


}
