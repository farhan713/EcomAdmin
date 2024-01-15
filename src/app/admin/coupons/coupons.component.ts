import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { MatDialog } from '@angular/material/dialog';
import { coupons } from './coupons';
import { CouponDialogComponent } from './coupon-dialog/coupon-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { Category } from 'src/app/app.models';
import { AppSettings, Settings } from 'src/app/app.settings';
import { HttpClient } from '@angular/common/http';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ClickStreamService } from 'src/app/shared/services/click-stream.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {
  public coupons = [];
  onewaySynonymsData: any = [];
  public stores = [
    { id: 1, name: 'Store 1' },
    { id: 2, name: 'Store 2' }
  ];
  public discountTypes = [
    { id: 1, name: 'Percentage discount' },
    { id: 2, name: 'Fixed Cart Discount' },
    { id: 3, name: 'Fixed Product Discount' }
  ];
  public categories: Category[];
  public page: any;
  public count = 6;
  public settings: Settings;
  constructor(public appService: AppService, private auth: AuthService, public dialog: MatDialog, public appSettings: AppSettings, public http: HttpClient,
    public router: Router, private overlayContainer: OverlayContainer,
    private clickService: ClickStreamService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.coupons = coupons;
    this.synonyms_oneway_getcall();
  }

  public getCategories() {
    this.appService.getCategories().subscribe(data => {
      this.categories = data;
      this.categories.shift();
    });
  }

  public onPageChanged(event) {
    this.page = event;
    window.scrollTo(0, 0);
  }

  public openCouponDialog(data: any) {
    console.log(data, "couponData")
    const dialogRef = this.dialog.open(CouponDialogComponent, {
      // data: {
      //   coupon: data,
      //   stores: this.stores,
      //   categories: this.categories,
      //   discountTypes: this.discountTypes
      // },
      data: data,
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: (this.settings.rtl) ? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(coupon => {
      if (coupon) {
        this.synonyms_oneway_getcall();
        location.reload();
      }
      if (coupon) {
        const index: number = this.coupons.findIndex(x => x.id == coupon.id);
        if (index !== -1) {
          this.coupons[index] = coupon;
        }
        else {
          let last_coupon = this.coupons[this.coupons.length - 1];
          coupon.id = last_coupon.id + 1;
          this.coupons.push(coupon);
        }
      }
    });
  }
  public synonyms_oneway_getcall() {
    //   this.http.get<any>('http://127.0.0.1:8000/console/'+this.clickService.getAdminOrgId()+'/dashboard/search_synonyms_all/' + '2').subscribe({
    //     next:data => { 
    //       console.log(data);
    //       this.onewaySynonymsData = data;
    //        console.log(this.onewaySynonymsData);
    //     //   this.onewaySynonymsData.forEach((element)=> {
    //     //     if(element.status == 'Active') {
    //     //       element['isChecked'] = true;
    //     //     }else{
    //     //       element['isChecked'] = false;
    //     //     }

    //     //  });
    //       console.log(this.onewaySynonymsData,"checked");
    //     }
    // });
    this.auth.sendHttpGet('http://127.0.0.1:8000/console/' + this.clickService.getAdminOrgId() + '/dashboard/search_synonyms_all/' + '2')
      .then((respData) => {
        console.log(respData);
        this.onewaySynonymsData = respData.datalist;
        console.log(this.onewaySynonymsData);
        this.onewaySynonymsData.forEach((element) => {
          if (element.status == 'Active') {
            element['isChecked'] = true;
          } else {
            element['isChecked'] = false;
          }
        });
        console.log(this.onewaySynonymsData, "checked");
        // this.data = respData.datalist;
      }).catch((error) => { console.log(error) });

  }
  public remove(onewaySynonyms: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm Action",
        message: "Are you sure you want remove this coupon?"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        let deleteId = onewaySynonyms.synonyms_id;
        this.http.delete<any>('http://127.0.0.1:8000/console/' + this.clickService.getAdminOrgId() + '/dashboard/search_synonyms_one/' + deleteId).subscribe({
          next: data => {
            this.synonyms_oneway_getcall();
            location.reload();
          },
          error: error => {
            console.log(error);

          }
        });

      }
      this.synonyms_oneway_getcall();
      location.reload();
    });
  }

  changeStatus(onewaySynonyms) {
    let status;
    if (onewaySynonyms.status == true) {
      status = "false";

    } else {
      status = "true";
    }
    let data = {
      data_tables: [
        {
          table_name: "tb_search_synonyms",
          data: {

            org_id: onewaySynonyms.org_id,
            store_id: onewaySynonyms.store_id,
            synonyms_id: onewaySynonyms.synonyms_id,
            synonyms_type_id: onewaySynonyms.synonyms_type_id,
            synonyms: "",
            searching_string: onewaySynonyms.searching_string,
            mapped_result_keywords: onewaySynonyms.mapped_result_keywords,
            status: status
          }

        }
      ]
    }
    // this.http.post<any>('http://127.0.0.1:8000/console/dashboard/search_synonyms_update', { response: data }).subscribe({
    //   next: data => {
    //     this.synonyms_oneway_getcall();
    //     // location.reload();
    //   },
    //   error: error => {
    //     console.log(error);

    //   }
    // })
    this.auth.sendHttpPost('http://127.0.0.1:8000/console/dashboard/search_synonyms_update', data)
      .then((respData) => {
        this.synonyms_oneway_getcall();
        location.reload();

      }).catch((error) => { console.log(error) });
  }

}
