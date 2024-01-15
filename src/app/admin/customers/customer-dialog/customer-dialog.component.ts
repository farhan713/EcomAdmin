import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ClickStreamService } from 'src/app/shared/services/click-stream.service';
import { AuthService } from 'src/app/shared/services/auth.service';


@Component({
  selector: 'app-customer-dialog',
  templateUrl: './customer-dialog.component.html',
  styleUrls: ['./customer-dialog.component.scss']
})
export class CustomerDialogComponent implements OnInit {
  public form: FormGroup;
  formvalue;
  isEdit: boolean;
  constructor(public dialogRef: MatDialogRef<CustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder, private http: HttpClient,
    private auth: AuthService,
    public router: Router, private overlayContainer: OverlayContainer,
    private clickService: ClickStreamService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      // id: 0, 
      synonyms: ['', Validators.required],
      searching_string: ['', Validators.required]
      // email: null,
      // firstName: ['', Validators.required],
      // lastName: ['', Validators.required],
      // middleName: null,
      // storeId: null,  
      // walletBalance: null, 
      // revenue: null,
      // billing: this.fb.group({ 
      //   firstName: ['', Validators.required],
      //   lastName: ['', Validators.required],
      //   middleName: '',
      //   company: '',
      //   email: ['', Validators.required],
      //   phone: ['', Validators.required],
      //   country: ['', Validators.required],
      //   city: ['', Validators.required],
      //   state: '',
      //   zip: ['', Validators.required],
      //   address: ['', Validators.required]
      // }) 
    });
    console.log(this.data, "HErre Form data");
    if (this.data) {
      this.form.patchValue(this.data);
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }

    // if(this.data.customer){
    //   this.form.patchValue(this.data.customer); 
    // };
  }

  public onSubmit() {
    console.log(this.data, "HErre Form data");
    let demo = this.form.value;
    console.log(demo, "ani9ket");
    let response;

    if (this.data) {
      response = {
        data_tables: [
          {
            table_name: "tb_search_synonyms",
            data: {

              org_id: this.data.org_id,
              store_id: this.data.store_id,
              synonyms_id: this.data.synonyms_id,
              synonyms_type_id: this.data.synonyms_type_id,
              synonyms: demo.synonyms,
              searching_string: demo.searching_string,
              mapped_result_keywords: "",
              status: "Active"
            }

          }
        ]
      }

    } else {
      response = {
        data_tables: [
          {
            table_name: "tb_search_synonyms",
            data: {
              org_id: this.clickService.getAdminOrgId(),
              store_id: "1",
              synonyms_id: -1,
              synonyms_type_id: 1,
              synonyms: demo.synonyms,
              searching_string: demo.searching_string,
              mapped_result_keywords: "",
              status: "true"
            }

          }
        ]
      }

    }
    console.log(this.form.value);


    // this.http.post<any>('http://127.0.0.1:8000/console/dashboard/search_synonyms_update',{response:response}).subscribe({
    //   next: data => {
    //     console.log(data);

    //   },
    //   error: error => {
    //     // console.log(error);

    //   }
    //   })
    this.auth.sendHttpPost('http://127.0.0.1:8000/console/dashboard/search_synonyms_update', response)
      .then((respData) => {
        console.log(respData);

      }).catch((error) => { console.log(error) });
    this.dialogRef.close(this.form.value);
  }





  public compareFunction(o1: any, o2: any) {
    return (o1.name == o2.name && o1.code == o2.code);
  }
  public getValues(val) {
    console.log(val);
  }

}
