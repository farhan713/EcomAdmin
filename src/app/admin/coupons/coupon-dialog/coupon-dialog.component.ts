import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ClickStreamService } from 'src/app/shared/services/click-stream.service';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-coupon-dialog',
  templateUrl: './coupon-dialog.component.html',
  styleUrls: ['./coupon-dialog.component.scss']
})
export class CouponDialogComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public products = []; 
  public form: FormGroup;
  isEdit: boolean;
  constructor(public dialogRef: MatDialogRef<CouponDialogComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any,
              public fb: FormBuilder,  private http: HttpClient,
              public router: Router, private overlayContainer: OverlayContainer,
              private clickService: ClickStreamService) { }

  ngOnInit(): void { 
    this.form = this.fb.group({
      // id: 0, 
      searching_string: ['', Validators.required],
      mapped_result_keywords: ['', Validators.required],
      // code: ['', Validators.required],
      // desc: null, 
      // discountType: null,
      // amount: null,
      // expiryDate: null,
      // allowFreeShipping: false,
      // storeId: null,
      // showOnStore: false,
      // restriction: this.fb.group({ 
      //   minimumSpend: null,
      //   maximumSpend: null,
      //   individualUseOnly: false,
      //   excludeSaleItems: false,
      //   products: [[]],
      //   categories: [[]]
      // }),
      // limit: this.fb.group({ 
      //   perCoupon: null,
      //   perItems: null,
      //   perUser: null
      // }) 
    }); 

    // if(this.data.coupon){
    //   this.form.patchValue(this.data.coupon);
    //   this.products = this.data.coupon.restriction.products;
    // };
    if(this.data){
      this.form.patchValue(this.data);
      this.isEdit = true;
    }else{
      this.isEdit = false;
    }
  }

  public onSubmit(){
     
     let groupedsynonyms = this.form.value;
     console.log(groupedsynonyms);
     let response;
      if(this.data){
          response = {
            data_tables: [
              {
                table_name: "tb_search_synonyms",
                data: {
                 
                  org_id :this.data.org_id,
                  store_id: this.data.store_id,
                  synonyms_id: this.data.synonyms_id,
                  synonyms_type_id: this.data.synonyms_type_id,
                  synonyms: "",
                  searching_string: groupedsynonyms.searching_string,
                  mapped_result_keywords: groupedsynonyms.mapped_result_keywords,
                  status: "Active"
                }
              }
            ]
          }
      }else{
          response = {
            data_tables: [
              {
                table_name: "tb_search_synonyms",
                data: {
                 
                  org_id :this.clickService.getAdminOrgId(),
                  store_id: "1",
                  synonyms_id: -1,
                  synonyms_type_id: 2,
                  synonyms: "",
                  searching_string: groupedsynonyms.searching_string,
                  mapped_result_keywords: groupedsynonyms.mapped_result_keywords,
                  status: "true"
                }
              }
            ]
          }
      }
     
    
    
    this.http.post<any>('http://127.0.0.1:8000/console/dashboard/search_synonyms_update', {response:response}).subscribe({
    next: data => {
      console.log(data);
     
    },
    error: error => {
      // console.log(error);
    
    }
    })
    this.dialogRef.close(this.form.value);
  } 

  public addProduct(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value; 
    if ((value || '').trim()) {
      this.products.push( value.trim() );
    } 
    if (input) {
      input.value = '';
    }  
    this.form['controls'].restriction['controls'].products.patchValue(this.products);
  }

  public removeProduct(fruit: any): void {
    const index = this.products.indexOf(fruit); 
    if (index >= 0) {
      this.products.splice(index, 1);
    }
    this.form['controls'].restriction['controls'].products.patchValue(this.products);
  }

}
