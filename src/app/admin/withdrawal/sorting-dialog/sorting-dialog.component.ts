import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { ClickStreamService } from 'src/app/shared/services/click-stream.service';
@Component({
  selector: 'app-sorting-dialog',
  templateUrl: './sorting-dialog.component.html',
  styleUrls: ['./sorting-dialog.component.scss']
})
export class SortingDialogComponent implements OnInit {
  public form: FormGroup;
  sortingLabel: any;
  sortingData: any;
  sortTypeInt: any;
  sortTypeString: any;
  keys: string[];
  setTypeDropDown;
  isIntOrString: any;
  isInt: boolean = true;
  isEdit:boolean;
  constructor(public dialogRef: MatDialogRef<SortingDialogComponent> ,public fb: FormBuilder , private http : HttpClient ,   @Inject(MAT_DIALOG_DATA) public data: any ,private changeRef : ChangeDetectorRef ,private clickService: ClickStreamService) { }
  
  ngOnInit(): void {
    this.getSortingData();
   
    this.form = this.fb.group({
      sorting_id: [null, Validators.required],
      status: false,
      sorting_felid: [null, Validators.required]
    }); 
    if(this.data.category){
  
      this.form.patchValue(this.data.category); 
      this.isEdit = true;
}else{
  this.isEdit = false;
}
  }
  public onSubmit(){
    if(this.form.valid){
   
      let formValues = this.form.value;
  
      let data;
      let status =  formValues.status.toString();
      if(this.data.category){
         data = {
         
          data_tables: [
            {
              table_name: "tb_sorting_type",
              data: {
                "sorting_id":this.data.category.sorting_id,
                "sorting_label": formValues.sorting_id.label,
                "sorting_felid": formValues.sorting_felid,
                 "order_id":1,
                  "status": status,
                  org_id : this.clickService.getAdminOrgId(),
                  store_id : -1
                  
                 
              }
            }
          ]
        }
      }else{
        data = {
         
          data_tables: [
            {
              table_name: "tb_sorting_type",
              data: {
                "sorting_id":-1,
                "sorting_label": formValues.sorting_id.label,
                "sorting_felid": formValues.sorting_felid,
                 "order_id":1,
                  "status": status,
                  org_id : this.clickService.getAdminOrgId(),
                  store_id : -1
                 
              }
            }
          ]
        }
      }

      this.http.post<any>('http://127.0.0.1:8000/console/dashboard/sorting_update',{response:data} ).subscribe({
        next: data => {
        //  this.pageSettingsName = data;
        this.dialogRef.close(data);
        },
        error: error => {
          console.log(error);
          this.dialogRef.close(error);
        }
      })
   
    }
  }
  getSortingData() {
    this.http.get<any>('http://127.0.0.1:8000/console/dashboard/sorting_details/').subscribe({
      next: data => {
       this.sortingData = data.dataset[0];

       let sortingDataLabels = this.sortingData.label;
    
      let newData :any =[];
      for (const key in sortingDataLabels) {
        newData.push({label : key , value : sortingDataLabels[key]})
    }
    this.sortingLabel = newData;
       this.sortTypeInt = this.sortingData.int_value;
       this.sortTypeString = this.sortingData.str_value;
      },
      error: error => {
        console.log(error);

      }
    })
  }
  onchange(e){
    this.changeRef.detectChanges();
    let demo = e.value.value;
   
    this.changeRef.detectChanges();
    if(demo[1] == 'int_value'){
      this.isInt = true;
      this.changeRef.detectChanges();
    }else{
      this.isInt = false;
      this.changeRef.detectChanges();
    }
  }
  
}
