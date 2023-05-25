import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-create-store',
  templateUrl: './create-store.component.html',
  styleUrls: ['./create-store.component.scss']
})
export class CreateStoreComponent implements OnInit {
  isEdit: boolean;
  orgnizationData: any;

  constructor( public fb: FormBuilder ,  @Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<CreateStoreComponent> ,private http: HttpClient) { }
  public form: FormGroup;
  ngOnInit(): void {
    this.getOrgdata()
    this.form = this.fb.group({
      org_id: ['', Validators.required],
      store_name: ['', Validators.required],
      status : false
    }); 
   
    if(this.data.data){
      this.form.patchValue(this.data.data); 
      this.isEdit =  true
    }else{
      this.isEdit = false;
    }
  }
  public onSubmit(){
  
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
              table_name: "tb_store",
              data: {
                "org_id": this.data.data.org_id,
                "store_no": this.data.data.store_no,
                "store_name": formValues.store_name,
                "status": status
              }
            }
          ]
        }
      }else{
   
        data = {
         
          data_tables: [
            {
              table_name: "tb_store",
              data: {
                "org_id": formValues.org_id,
                "store_no": -1,
                "store_name": formValues.store_name,
                "status": status
              }
            }
          ]
        }
      }
     
      this.http.post<any>('http://127.0.0.1:8000/console/store',{response:data} ).subscribe({
        next: data => {
        },
        error: error => {
          console.log(error);
  
        }
      })
      this.dialogRef.close(this.form.value);
    }
  }
  getOrgdata() {
    this.http.get<any>('http://127.0.0.1:8000/console/all_organization_data').subscribe({
      next: data => {


        let tempData =  data.dataset;
        tempData.forEach((val)=>{
            // console.log(val)
          if(val.status == "false"){
            val.status = false
          }else{
            val.status = true;
          }
        })
       this.orgnizationData = tempData;
      },
      error: error => {
        console.log(error);

      }
    })
  }
}
