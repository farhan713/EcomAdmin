import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClickStreamService } from 'src/app/shared/services/click-stream.service';
@Component({
  selector: 'app-create-orgnization',
  templateUrl: './create-orgnization.component.html',
  styleUrls: ['./create-orgnization.component.scss']
})
export class CreateOrgnizationComponent implements OnInit {
  public form: FormGroup;
  isEdit: boolean;
  constructor( public fb: FormBuilder ,  @Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<CreateOrgnizationComponent> ,private http: HttpClient ,private clickService: ClickStreamService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      org_name: ['', Validators.required],
      status: false,
      orh_url : ['', Validators.required],
    }); 

    if(this.data.data){
      this.form.patchValue(this.data.data); 
      this.isEdit =  true;
    }else{
      this.isEdit = false;
    }
  }

  public onSubmit(){
    console.log(this.form.value)
    console.log(this.form.valid)
    if(this.form.valid){
      let formValues = this.form.value;
      let data;
      let status1 =  formValues.status;
      let status
      if(status1 == false){
        status =  "False"
      }else{
        status = "True"
      }
      if(this.data.data){
         data = {
         
          data_tables: [
            {
              table_name: "tb_organization",
              data: {
                "org_id": this.data.data.org_id,
                "org_name": formValues.org_name,
                "status": status,
                "orh_url" :formValues.orh_url
              }
            }
          ]
        }
      }else{
        data = {
         
          data_tables: [
            {
              table_name: "tb_organization",
              data: {
                org_id: -1,
                "org_name": formValues.org_name,
                "status": status,
                "org_url" :formValues.orh_url
              }
            }
          ]
        }
      }
     
      this.http.post<any>('http://127.0.0.1:8000/console/organization',{response:data} ).subscribe({
        next: data => {
        },
        error: error => {
          console.log(error);
  
        }
      })
      this.dialogRef.close(this.form.value);
    }
  }
}
