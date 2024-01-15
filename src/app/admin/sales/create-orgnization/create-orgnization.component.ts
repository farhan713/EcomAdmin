import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ClickStreamService } from 'src/app/shared/services/click-stream.service';
@Component({
  selector: 'app-create-orgnization',
  templateUrl: './create-orgnization.component.html',
  styleUrls: ['./create-orgnization.component.scss']
})
export class CreateOrgnizationComponent implements OnInit {
  public form: FormGroup;
  isEdit: boolean;
  cronExpression: string;
  selectedIntervalProdFile: any;
  selectedIntervalSalesFile: any
  croneTimeList: any = [];
  salesFilecronExpression: string;
  prodFilecronExpression: string;
  constructor(public fb: FormBuilder, private auth: AuthService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<CreateOrgnizationComponent>, private http: HttpClient, private clickService: ClickStreamService) { }

  ngOnInit(): void {


    this.form = this.fb.group({
      org_name: ['', Validators.required],
      status: false,
      // org_url : ['', Validators.required],
      product_file_location: ['', Validators.required],

      product_file_cron_time: ['', Validators.required],

      trans_file_location: ['', Validators.required],

      trans_file_cron_time: ['', Validators.required],
      email_id: ['', Validators.email],


    });

    if (this.data.data) {
      this.form.patchValue(this.data.data);
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }

    this.generateCronTimeList();
  }


  public onSubmit() {

    console.log(this.form.value)
    console.log(this.form.valid)
    if (this.form.valid) {
      let formValues = this.form.value;
      let data;
      let status1 = formValues.status;
      let status
      if (status1 == false) {
        status = "False"
      } else {
        status = "True"
      }
      if (this.data.data) {
        data = {

          data_tables: [
            {
              table_name: "tb_organization",
              data: {
                "org_id": this.data.data.org_id,
                "org_name": formValues.org_name,
                "status": status,
                // "org_url" :formValues.orh_url, 
                "product_file_location": formValues.product_file_location,
                "product_file_cron_time": this.prodFilecronExpression,
                "trans_file_location": formValues.trans_file_location,
                "trans_file_cron_time": this.salesFilecronExpression,
                "email_id": formValues.email_id
              }
            }
          ]
        }
      } else {
        data = {

          data_tables: [
            {
              table_name: "tb_organization",
              data: {
                org_id: -1,
                "org_name": formValues.org_name,
                "status": status,
                // "org_url" :formValues.orh_url,
                "product_file_location": formValues.product_file_location,
                "product_file_cron_time": this.prodFilecronExpression,
                "trans_file_location": formValues.trans_file_location,
                "trans_file_cron_time": this.salesFilecronExpression,
                "email_id": formValues.email_id
              }
            }
          ]
        }
      }

      // this.http.post<any>('http://127.0.0.1:8000/console/organization', { response: data }).subscribe({
      //   next: data => {
      //     this.dialogRef.close(this.form.value);
      //   },
      //   error: error => {
      //     console.log(error);
      //     // this.dialogRef.close(this.form.value);
      //     alert("eror in creating org please try again")

      //   }
      // })
      this.auth.sendHttpPost('http://127.0.0.1:8000/console/organization', data)
        .then((respData) => {
          this.dialogRef.close(this.form.value);
          location.reload();

        }).catch((error) => {
          console.log(error);
          alert("eror in creating org please try again")

        });
    }
  }

  generateCronTimeList() {
    for (let i = 1; i <= 48; i++) {
      this.croneTimeList.push({
        label: `Every ${i} Hour${i !== 1 ? 's' : ''}`,
        value: i,
      });
    }
    console.log(this.croneTimeList)
  }

  onChangeOfCroneTimeProdFile() {
    this.prodFilecronExpression = `0 0 */${this.selectedIntervalProdFile} * * ?`;
    console.log(this.prodFilecronExpression)
  }
  onChangeOfCroneTimeSalesFile() {
    this.salesFilecronExpression = `0 0 */${this.selectedIntervalSalesFile} * * ?`;
    console.log(this.salesFilecronExpression)
  }
}
