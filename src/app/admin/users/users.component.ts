import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppSettings, Settings } from '../../app.settings';
import { User, UserProfile, UserWork, UserContacts, UserSocial, UserSettings } from './user.model';
import { UsersService } from './users.service';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatMenuTrigger } from '@angular/material/menu';
import { HttpClient } from '@angular/common/http';
import { Console, log } from 'console';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClickStreamService } from 'src/app/shared/services/click-stream.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [UsersService]
})
export class UsersComponent implements OnInit {
  public users: User[];
  public searchText: string;
  public page: any;
  public settings: Settings;
  brandList: any = [];
  selectedBrands: any = [];
  deptList: any = [];
  selectedDepts: any = [];
  typeList: any = [];
  selectedTypes: any = [];
  subTypeList: any = [];
  selectedSubtypes: any = [];

  isBrandSelected: boolean = false;
  isDeptSelected: boolean = false;
  isTypeSelected: boolean = false;
  isSubtypeSelected: boolean = false;

  isOpen: boolean = false;


  requestBody = {
    query: "",
    brand: [],
    dept: [],
    type: [],
    subtype: [],
    sorting_label: ""
  }
  productList: any = [];
  contentPlaceholder: MatMenuTrigger;
  config = {
    disableClose: false,
    panelClass: 'custom-overlay-pane-class',
    hasBackdrop: true,
    backdropClass: '',
    width: '',
    height: '',
    minWidth: '',
    minHeight: '',

    maxHeight: '',
    position: {
      top: '0',
      bottom: '',
      left: '',
      right: ''
    },
    data: {
      message: 'Jazzy jazz jazz'
    }
  };
  user: any;
  movies = [
    'Episode I - The Phantom Menace',
    'Episode II - Attack of the Clones',
    'Episode III - Revenge of the Sith',
    'Episode IV - A New Hope',
    'Episode V - The Empire Strikes Back',
    'Episode VI - Return of the Jedi',
    'Episode VII - The Force Awakens',
    'Episode VIII - The Last Jedi'
  ];

  sortingListL: any = []

  sseCallTimer = 0;
  searchedQuery: any = '';
  interValChecker;
  serverRes: any;
  selectedKeyword: any = '';
  searchedProductList: any = [];
  selectedSorting: any = "";
  pinnedFromSearchList: any = [];
  keyWordTobeSend: any = '';
  queryTobeSend: any = '';
  orgId: string | number;
  keywordsList :any = [];
  constructor(public appSettings: AppSettings,
    public dialog: MatDialog,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    public usersService: UsersService, private clickService: ClickStreamService) {
    this.settings = this.appSettings.settings;
  }

  @ViewChild("menuTrigger", { static: false }) set menuTrigger(
    content: MatMenuTrigger
  ) {
    if (content) {
      this.contentPlaceholder = content;
    }
  }
  matCard;
  ngOnInit() {
    this.orgId = this.clickService.getAdminOrgId();
    this.requestBody.query = '';
    this.requestBody.brand = this.selectedBrands;
    this.requestBody.type = this.selectedTypes;
    this.requestBody.dept = this.selectedDepts;
    this.requestBody.subtype = this.selectedSubtypes;
    this.requestBody.sorting_label = this.selectedSorting
    console.log(this.requestBody);

    // this.getUsers();  
    // this.getAllAtributes();
    this.getSortingList();
    this.getProductList();

  }

  getSortingList() {
    this.spinner.show()
    this.http.get<any>('http://127.0.0.1:8000/console/' + this.clickService.getAdminOrgId() + '/dashboard/sorting_all').subscribe({
      next: data => {
        console.log(data);
        this.sortingListL = data.dataset;
        this.spinner.hide()
      },
      error: error => {
        console.log(error);
        this.spinner.hide()
      }
    })
  }

  getProductList() {
    this.productList = [];
    this.brandList = [];
    this.deptList = [];
    this.typeList = [];
    this.subTypeList = [];
    this.http.post<any>('http://127.0.0.1:8000/console/' + this.orgId + '/site_search/site_setting/' + '1' + '/' + '500', { response: this.requestBody }).subscribe({
      next: data => {
        console.log(data);
        this.serverRes = data.dataset;
        if (this.requestBody.query != '') {
          if (this.selectedKeyword == '') {
            this.selectedKeyword = this.serverRes[0].keyword
          }
          console.log(this.selectedKeyword);
          this.keyWordTobeSend = this.selectedKeyword;
          this.queryTobeSend = this.searchedQuery;
          this.serverRes.forEach(main => {
            if (main.keyword == this.selectedKeyword) {
              main.category_filter.brand.forEach(element => {
                if (this.requestBody.brand.includes(element)) {
                  this.brandList.push({ isSelected: true, name: element })
                } else {
                  this.brandList.push({ isSelected: false, name: element })
                }

              });
              main.category_filter.dept.forEach(element => {
                if (this.requestBody.dept.includes(element)) {
                  this.deptList.push({ isSelected: true, name: element })
                } else {
                  this.deptList.push({ isSelected: false, name: element })
                }

              });
              main.category_filter.type.forEach(element => {
                if (this.requestBody.type.includes(element)) {
                  this.typeList.push({ isSelected: true, name: element })
                } else {
                  this.typeList.push({ isSelected: false, name: element })
                }
              });
              main.category_filter.subtype.forEach(element => {
                if (this.requestBody.subtype.includes(element)) {
                  this.subTypeList.push({ isSelected: true, name: element })
                } else {
                  this.subTypeList.push({ isSelected: false, name: element })
                }
              });
              let demo = main.products;

              const arrayUniqueByKey: any = [...new Map(demo.map(item =>
                [item['product_id'], item])).values()];
              this.productList = arrayUniqueByKey;
              this.productList.forEach(el => {
                el.image_url = 'https://www.mastgeneralstore.com/' + el.image_url;
                el["pinned"] = false;
              });
            }
          })
        } else {
          data.dataset[0].category_filter.brand.forEach(element => {
            if (this.requestBody.brand.includes(element)) {
              this.brandList.push({ isSelected: true, name: element })
            } else {
              this.brandList.push({ isSelected: false, name: element })
            }

          });
          data.dataset[0].category_filter.dept.forEach(element => {
            if (this.requestBody.dept.includes(element)) {
              this.deptList.push({ isSelected: true, name: element })
            } else {
              this.deptList.push({ isSelected: false, name: element })
            }

          });
          data.dataset[0].category_filter.type.forEach(element => {
            if (this.requestBody.type.includes(element)) {
              this.typeList.push({ isSelected: true, name: element })
            } else {
              this.typeList.push({ isSelected: false, name: element })
            }
          });
          data.dataset[0].category_filter.subtype.forEach(element => {
            if (this.requestBody.subtype.includes(element)) {
              this.subTypeList.push({ isSelected: true, name: element })
            } else {
              this.subTypeList.push({ isSelected: false, name: element })
            }
          });
          let demo = data.dataset[0].products;

          const arrayUniqueByKey: any = [...new Map(demo.map(item =>
            [item['product_id'], item])).values()];
          this.productList = arrayUniqueByKey;
          this.productList.forEach(element => {
            element.image_url = 'https://www.mastgeneralstore.com/' + element.image_url;
            element["pinned"] = false;
          });
        }

      },
      error: error => {
        console.log(error);

      }
    })
  }
  dropped(product, index) {
    console.log(product);
    console.log(index);

  }

  pushtoOld(product) {
    this.productList.unshift(product);
    this.searchedProductList.forEach(element => {
      if (element.product_id == product.product_id) {
        element.pinned = true;
      }
    });
    this.pinnedFromSearchList.push(product);
    console.log(this.pinnedFromSearchList);

  }

  closeSearchBox() {
    this.contentPlaceholder.closeMenu();
  }
  method2(product) {
    console.log(product);
    console.log(this.productList);
    let data = this.productList;
    data.unshift(data.splice(data.findIndex(item => item.product_id == product.product_id), 1)[0])
    this.productList = data;
    this.productList.forEach(element => {
      if (element.product_id == product.product_id) {
        element.pinned = true;
      }
    });
  }

  getAllAtributes() {
    this.http.get<any>('http://127.0.0.1:8000/' + this.clickService.getAdminOrgId() + '/all_attributes').subscribe({
      next: data => {
        console.log(data)

        data.dataset[0].brand.forEach(element => {
          this.brandList.push({ isSelected: false, name: element })
        });
        data.dataset[1].dept.forEach(element => {
          this.deptList.push({ isSelected: false, name: element })
        });
        data.dataset[2].type.forEach(element => {
          this.typeList.push({ isSelected: false, name: element })
        });
        data.dataset[3].subtype.forEach(element => {
          this.subTypeList.push({ isSelected: false, name: element })
        });
      },
      error: error => {
        console.log(error);

      }
    })

  }
  filterByQueryNew(e) {
    this.contentPlaceholder.closeMenu();
    this.searchedQuery = '';
    this.searchedQuery = e.target.value;

    this.searchedProductList = []
    this.requestBody.query = e.target.value;
    if (this.interValChecker) {
      this.sseCallTimer = 0;
      clearInterval(this.interValChecker)
    }

    if (e.target.value.length >= 3) {
      this.interValChecker = setInterval(() => {
        this.sseCallTimer++;
        if (this.sseCallTimer >= 1) {
          if (e.keyCode == 13) {
            console.log(e.target.value);

            clearInterval(this.interValChecker);
            this.contentPlaceholder.closeMenu();
            // this.goToCatBySearch(e.target.value);
            this.requestBody.query = this.selectedKeyword;
            this.getProductList();
          } else {
            clearInterval(this.interValChecker)
           
            this.spinner.show()
            this.http.post<any>('http://127.0.0.1:8000/sse/' + this.orgId + '/site_search/site_search_keywords/' + '1', { query: e.target.value }).subscribe({
              next: data => {
                this.spinner.hide();
                this.keywordsList = [];
                this.contentPlaceholder.openMenu();
                console.log(data);
                this.keywordsList = data.dataset
                this.selectedKeyword = data.dataset[0];
                if (this.keyWordTobeSend === '') {
                  this.keyWordTobeSend = data.dataset[0];
                }
                if (this.queryTobeSend === '') {
                  this.queryTobeSend = e.target.value;
                }
                console.log(this.keyWordTobeSend);
                this.selectKeyWord(this.selectedKeyword)
                // let demo = data.dataset[0].products;
                // const arrayUniqueByKey: any = [...new Map(demo.map(item =>
                //   [item['product_id'], item])).values()];
                // this.searchedProductList = arrayUniqueByKey;
                // this.searchedProductList.forEach(element => {
                //   element.image_url = 'https://www.mastgeneralstore.com/' + element.image_url;
                //   element["pinned"] = false;
                // });
              },
              error: error => {
                console.log(error);

              }
            })
          }
        }

      }, 1000);



    } else {

    }
  }

selectKeyWord(keyword) {
  this.selectedKeyword = keyword;
  this.getProductsBykeyword(keyword)
}

selectKeyWord1(keyword) {
  if (!this.matCard) return;
  this.selectedKeyword = keyword;
  this.getProductsBykeyword(keyword)
}

cardClick(keyword): void {
  this.matCard = setTimeout( () => {this.selectKeyWord1(keyword);}, 300); 
}
cardDoubleClick(keyword): void {
    clearTimeout(this.matCard);
    this.matCard = undefined;
    this.requestBody.query = keyword
    this.doubleClickKeyword(keyword);
}


  getProductsBykeyword(keyword) {
    console.log(keyword);
    
    let request = {
      query: keyword,
      brand: [],
      dept: [],
      type: [],
      subtype: [],
      sorting_label: ""
    }
    this.http.post<any>('http://127.0.0.1:8000/console/' + this.orgId + '/site_search/site_setting/' + '1' + '/' + '100', { response: request }).subscribe({
      next: data => {

        this.contentPlaceholder.openMenu();
        console.log(data);
        this.serverRes = data.dataset;
      
     
       
        let demo = data.dataset[0].products;
        const arrayUniqueByKey: any = [...new Map(demo.map(item =>
          [item['product_id'], item])).values()];
        this.searchedProductList = arrayUniqueByKey;
        this.searchedProductList.forEach(element => {
          element.image_url = 'https://www.mastgeneralstore.com/' + element.image_url;
          element["pinned"] = false;
        });
      },
      error: error => {
        console.log(error);

      }
    })
  }
  doubleClickKeyword(keyword) {
    console.log(this.requestBody);
    console.log(keyword);
    this.selectedKeyword = keyword;
    this.getProductList();
    this.contentPlaceholder.closeMenu();
  }

  filterByQuery(e) {
    this.brandList = [];
    this.deptList = [];
    this.typeList = [];
    this.subTypeList = [];
    this.productList = [];
    this.searchedQuery = '';
    this.searchedQuery = e.target.value;
    this.requestBody.query = e.target.value;
    if (this.interValChecker) {
      this.sseCallTimer = 0;
      clearInterval(this.interValChecker)
    }

    if (e.target.value.length >= 3) {
      this.interValChecker = setInterval(() => {
        this.sseCallTimer++;
        if (this.sseCallTimer >= 3) {
          if (e.keyCode == 13) {
            clearInterval(this.interValChecker);
            this.contentPlaceholder.closeMenu();
            this.getProductList();
            // this.goToCatBySearch(e.target.value)
          } else {
            clearInterval(this.interValChecker)
            this.http.post<any>('http://127.0.0.1:8000/' + this.orgId + '/console/site_search/site_setting/' + '1' + '/' + '100', { response: this.requestBody }).subscribe({
              next: data => {
                console.log(data);
                this.serverRes = data.dataset;
                let demo = data.dataset[0].products;
                this.selectedKeyword = data.dataset[0].keyword;
                data.dataset[0].category_filter.brand.forEach(element => {
                  if (this.requestBody.brand.includes(element)) {
                    this.brandList.push({ isSelected: true, name: element })
                  } else {
                    this.brandList.push({ isSelected: false, name: element })
                  }

                });
                data.dataset[0].category_filter.dept.forEach(element => {
                  if (this.requestBody.dept.includes(element)) {
                    this.deptList.push({ isSelected: true, name: element })
                  } else {
                    this.deptList.push({ isSelected: false, name: element })
                  }

                });
                data.dataset[0].category_filter.type.forEach(element => {
                  if (this.requestBody.type.includes(element)) {
                    this.typeList.push({ isSelected: true, name: element })
                  } else {
                    this.typeList.push({ isSelected: false, name: element })
                  }
                });
                data.dataset[0].category_filter.subtype.forEach(element => {
                  if (this.requestBody.subtype.includes(element)) {
                    this.subTypeList.push({ isSelected: true, name: element })
                  } else {
                    this.subTypeList.push({ isSelected: false, name: element })
                  }
                });
                const arrayUniqueByKey: any = [...new Map(demo.map(item =>
                  [item['product_id'], item])).values()];
                this.productList = arrayUniqueByKey;
                this.productList.forEach(element => {
                  element.image_url = 'https://www.mastgeneralstore.com/' + element.image_url;
                  element["pinned"] = false;
                });
              },
              error: error => {
                console.log(error);

              }
            })
          }
        }

      }, 1000);



    } else {

    }
  }

  updateSorting(item) {
    console.log(item);
    let selectedItem;
this.sortingListL.forEach(element => {
  console.log(element.sorting_id);
  if(element.sorting_id == item) {
    selectedItem = element
  }
});
   console.log(selectedItem);
   
    
    console.log("in sorting");
    this.productList = [];
    this.requestBody.sorting_label = selectedItem.sorting_felid + ':' + selectedItem.sorting_label;
    console.log(this.selectedSorting);

    if (this.requestBody.query == '') {
      this.http.post<any>('http://127.0.0.1:8000/console/' + this.orgId + '/site_search/site_setting/' + '1' + '/' + '100', { response: this.requestBody }).subscribe({
        next: data => {
          this.serverRes = data.dataset;
          data.dataset[0].category_filter.brand.forEach(element => {
            if (this.requestBody.brand.includes(element)) {
              this.brandList.push({ isSelected: true, name: element })
            } else {
              this.brandList.push({ isSelected: false, name: element })
            }

          });
          data.dataset[0].category_filter.dept.forEach(element => {
            if (this.requestBody.dept.includes(element)) {
              this.deptList.push({ isSelected: true, name: element })
            } else {
              this.deptList.push({ isSelected: false, name: element })
            }

          });
          data.dataset[0].category_filter.type.forEach(element => {
            if (this.requestBody.type.includes(element)) {
              this.typeList.push({ isSelected: true, name: element })
            } else {
              this.typeList.push({ isSelected: false, name: element })
            }
          });
          data.dataset[0].category_filter.subtype.forEach(element => {
            if (this.requestBody.subtype.includes(element)) {
              this.subTypeList.push({ isSelected: true, name: element })
            } else {
              this.subTypeList.push({ isSelected: false, name: element })
            }
          });
          let demo = data.dataset[0].products;

          const arrayUniqueByKey: any = [...new Map(demo.map(item =>
            [item['product_id'], item])).values()];
          this.productList = arrayUniqueByKey;
          this.productList.forEach(element => {
            element.image_url = 'https://www.mastgeneralstore.com/' + element.image_url;
            element["pinned"] = false;
          });
        },
        error: error => {
          console.log(error);

        }
      })
    } else {
      
      this.http.post<any>('http://127.0.0.1:8000/console/' + this.orgId + '/site_search/site_setting/' + '1' + '/' + '100', { response: this.requestBody }).subscribe({
        next: data => {
          this.serverRes = data.dataset;
          this.serverRes.forEach(element => {


            if (element.keyword == this.selectedKeyword) {
              console.log(element);
              let demo = element.products;
              element.category_filter.brand.forEach(element => {
                if (this.requestBody.brand.includes(element)) {
                  this.brandList.push({ isSelected: true, name: element })
                } else {
                  this.brandList.push({ isSelected: false, name: element })
                }

              });
              element.category_filter.dept.forEach(element => {
                if (this.requestBody.dept.includes(element)) {
                  this.deptList.push({ isSelected: true, name: element })
                } else {
                  this.deptList.push({ isSelected: false, name: element })
                }

              });
              element.category_filter.type.forEach(element => {
                if (this.requestBody.type.includes(element)) {
                  this.typeList.push({ isSelected: true, name: element })
                } else {
                  this.typeList.push({ isSelected: false, name: element })
                }
              });
              element.category_filter.subtype.forEach(element => {
                if (this.requestBody.subtype.includes(element)) {
                  this.subTypeList.push({ isSelected: true, name: element })
                } else {
                  this.subTypeList.push({ isSelected: false, name: element })
                }
              });
              const arrayUniqueByKey: any = [...new Map(demo.map(item =>
                [item['product_id'], item])).values()];
              this.productList = arrayUniqueByKey;
              console.log("product list", this.productList);

              this.productList.forEach(el => {
                if (el.image_url.startsWith("https")) {
                } else {
                  el.image_url = 'https://www.mastgeneralstore.com/' + el.image_url;
                }

                el["pinned"] = false;
              });
            }
          });
        },
        error: error => {
          console.log(error);

        }
      })
    }


  }

  changeByKeyword(keyword) {
    this.contentPlaceholder.openMenu();
    this.selectedKeyword = keyword;
    this.serverRes.forEach(element => {
      if (element.keyword == keyword) {
        console.log(element);
        let demo = element.products;
        const arrayUniqueByKey: any = [...new Map(demo.map(item =>
          [item['product_id'], item])).values()];
        this.searchedProductList = arrayUniqueByKey;
        console.log("product list", this.productList);

        this.searchedProductList.forEach(el => {
          if (el.image_url.startsWith("https")) {
          } else {
            el.image_url = 'https://www.mastgeneralstore.com/' + el.image_url;
          }

          el["pinned"] = false;
        });
      }
    });

  }


  filterBrand(e, item) {
    this.brandList.forEach(element => {
      if (element.name == item.name) {
        element.isSelected = e.checked
      }
    });
    if (e.checked) {
      this.requestBody.brand.push(item.name)
    } else {
      var index = this.requestBody.brand.indexOf(item.name);
      if (index >= 0) {
        this.requestBody.brand.splice(index, 1);
      }
    }
    setTimeout(() => {
      this.getProductList();
    }, 500);
    console.log(this.requestBody);

  }
  filterDept(e, item) {
    this.deptList.forEach(element => {
      if (element.name == item.name) {
        element.isSelected = e.checked
      }
    });
    if (e.checked) {
      this.requestBody.dept.push(item.name)
    } else {
      var index = this.requestBody.dept.indexOf(item.name);
      if (index >= 0) {
        this.requestBody.dept.splice(index, 1);
      }
    }
    setTimeout(() => {
      this.getProductList();
    }, 500);
    console.log(this.requestBody);
  }

  filterType(e, item) {
    this.typeList.forEach(element => {
      if (element.name == item.name) {
        element.isSelected = e.checked
      }
    });
    if (e.checked) {
      this.requestBody.type.push(item.name)
    } else {
      var index = this.requestBody.type.indexOf(item.name);
      if (index >= 0) {
        this.requestBody.type.splice(index, 1);
      }
    }
    setTimeout(() => {
      this.getProductList();
    }, 500);
    console.log(this.requestBody);
  }
  filterSubType(e, item) {
    this.subTypeList.forEach(element => {
      if (element.name == item.name) {
        element.isSelected = e.checked
      }
    });
    if (e.checked) {
      this.requestBody.subtype.push(item.name)
    } else {
      var index = this.requestBody.subtype.indexOf(item.name);
      if (index >= 0) {
        this.requestBody.subtype.splice(index, 1);
      }
    }
    setTimeout(() => {
      this.getProductList();
    }, 500);
    console.log(this.requestBody);
  }

  selectBrand() {
    this.isBrandSelected = true;
    this.isDeptSelected = false;
    this.isTypeSelected = false;
    this.isSubtypeSelected = false;
  }

  selectDept() {
    this.isBrandSelected = false;
    this.isDeptSelected = true;
    this.isTypeSelected = false;
    this.isSubtypeSelected = false;
  }

  selectType() {
    this.isBrandSelected = false;
    this.isDeptSelected = false;
    this.isTypeSelected = true;
    this.isSubtypeSelected = false;
  }

  selectSubType() {
    this.isBrandSelected = false;
    this.isDeptSelected = false;
    this.isTypeSelected = false;
    this.isSubtypeSelected = true;
  }

  removeFilter(name) {
    if (name == "brand") {
      this.requestBody.brand = [];
      this.brandList.forEach(element => {
        element.isSelected = false;
      });
    }
    if (name == "dept") {
      this.requestBody.dept = [];
      this.deptList.forEach(element => {
        element.isSelected = false;
      });
    }
    if (name == "type") {
      this.requestBody.type = [];
      this.typeList.forEach(element => {
        element.isSelected = false;
      });
    }
    if (name == "subtype") {
      this.requestBody.subtype = [];
      this.subTypeList.forEach(element => {
        element.isSelected = false;
      });
    }
    console.log(this.requestBody);
    this.getProductList();
  }

  drop(event: CdkDragDrop<string[]>, product, index) {
    console.log(event);
    console.log(product);
    console.log(index);
    moveItemInArray(this.productList, event.previousIndex, event.currentIndex);
    console.log(this.productList);
    let productsToBesend = [];
    let pinnedProducts = [];
    setTimeout(() => {
      this.productList.forEach(element => {
        productsToBesend.push(element.product_id);
        if (element.pinned) {
          pinnedProducts.push(element.product_id);
        }
      });
      console.log(productsToBesend);
      console.log(pinnedProducts);

      let data = {
        response: {
          data_tables: [
            {
              table_name: "tb_search_query_boost",
              data: {
                org_id: -1,
                store_id: -1,
                brand: this.requestBody.brand,
                dept: this.requestBody.dept,
                type: this.requestBody.type,
                subtype: this.requestBody.subtype,
                sku_id_list_in_seq: productsToBesend,
                sku_id_list_in_seq_pinned: pinnedProducts
              }
            }
          ]
        }
      }
    }, 1000);
  }

  saveSequence() {
    this.spinner.show();
    let productsToBesend = [];
    let pinnedProducts = [];

    this.productList.forEach(element => {
      productsToBesend.push(element.product_id);
      if (element.pinned) {
        pinnedProducts.push(element.product_id);
      }
    });

    setTimeout(() => {
      let data = {

        data_tables: [
          {
            table_name: "tb_search_query_boost",
            data: {
              org_id: this.clickService.getAdminOrgId(),
              store_id: -1,
              brand: this.requestBody.brand,
              dept: this.requestBody.dept,
              type: this.requestBody.type,
              search_query: this.queryTobeSend,
              keyword: this.keyWordTobeSend,
              subtype: this.requestBody.subtype,
              sku_id_list_in_seq: productsToBesend,
              sku_id_list_in_seq_pinned: pinnedProducts
            }
          }
        ]

      }
      console.log(data);
      this.http.post<any>('http://127.0.0.1:8000/console/search_query_booster', { response: data }).subscribe({
        next: data => {
          console.log(data);
          this.spinner.hide();
        },
        error: error => {
          // console.log(error);

        }
      })
    }, 500);

  }

  deleteProductFromList(product) {
    this.productList.splice(this.productList.findIndex(({ product_id }) => product_id == product.product_id), 1);
  }

  public getUsers(): void {
    this.users = null; //for show spinner each time
    this.usersService.getUsers().subscribe(users => this.users = users);
  }
  public addUser(user: User) {
    this.usersService.addUser(user).subscribe(user => this.getUsers());
  }
  public updateUser(user: User) {
    this.usersService.updateUser(user).subscribe(user => this.getUsers());
  }
  public deleteUser(user: User) {
    this.usersService.deleteUser(user.id).subscribe(user => this.getUsers());
  }


  public onPageChanged(event) {
    this.page = event;
    this.getUsers();
    window.scrollTo(0, 0);
    // if(this.settings.fixedHeader){      
    //     document.getElementById('main-content').scrollTop = 0;
    // }
    // else{
    //     document.getElementsByClassName('mat-drawer-content')[0].scrollTop = 0;
    // }
  }

  public openUserDialog() {
    this.isOpen = !this.isOpen;
    // let dialogRef = this.dialog.open(UserDialogComponent, {
    //   data: user,
    //   panelClass: 'Abc',
    // });

    // dialogRef.afterClosed().subscribe(user => {
    //   if (user) {
    //     (user.id) ? this.updateUser(user) : this.addUser(user);
    //   }
    // });
  }

  public openUserDialogbox(userbox) {
    var dialogRef = this.dialog.open(UserDialogComponent, {
      panelClass: 'custom-modalbox !important',
      height: '200px !important',


    });
  }

}