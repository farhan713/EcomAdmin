
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ClickStreamService } from 'src/app/shared/services/click-stream.service';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent implements OnInit {
  public form: FormGroup;
  pageNames ;
  pageSettingsName: any;
  pageNamesReccomendation: any;
  reccomendationData: any;
  reccomadationLabel: any;
  recTypeOne: any;
  recTypeTwo: any;
  typeOne = true;
  recommendation_type_page_placement_id: void;
  recommendation_type: any;
  recommendation_type_id: any;
  typeTwo: boolean;
  typeThree: boolean;
  recTypeThree: any;
  constructor(public dialogRef: MatDialogRef<CategoryDialogComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any,
              public fb: FormBuilder , private http: HttpClient , private changeRef : ChangeDetectorRef ,
              private clickService: ClickStreamService) { }

  ngOnInit(): void { 
    this.getRecommendationTypePageNames();
    // this.getRecommendationTypePageData();
    this.getDemo();
    this.form = this.fb.group({
      // id: 0,
      recommendation_type_id: [null, Validators.required],
      status: false,
      recommendation_type_page_placement_id: [null, Validators.required]
    }); 

    if(this.data.category){

            this.form.patchValue(this.data.category); 
    };
  }

  public onSubmit(){
    if(this.form.valid){
      let formValues = this.form.value;

      // let label;
      let data;
      let pageName;
      let status1 =  formValues.status;

      let status
      if(status1 == false){
        status =  "False"
      }else{
        status = "True"
      }
      this.pageNamesReccomendation.forEach((val)=>{
        if(val.recommendation_type_page_placement_id == this.recommendation_type_page_placement_id){
          pageName = val.page_name
        }
      })
      // this.pageSettingsName.forEach((val)=>{
      //   if(val.recommendation_type_id == formValues.recommendation_type_id){
      //     label = val.label;
      //   }
      // })
      
      if(this.data.category){
         data = {
         
          data_tables: [
            {
              table_name: "tb_recommendation_type_page_placement",
              data: {
                org_id: this.clickService.getAdminOrgId(),
                store_id: -1,
                "recommendation_type_page_placement_id":this.recommendation_type_page_placement_id,
                "user_recommendation_id": this.data.category.user_recommendation_id,
                "recommendation_type_id":  this.recommendation_type_id,
                 "page_name":pageName,
                  "status": status,
                  "label" :this.recommendation_type 
              }
            }
          ]
        }
      }else{
        data = {
          data_tables: [
            {
              table_name: "tb_recommendation_type_page_placement",
              data: {
                org_id: this.clickService.getAdminOrgId(),
                store_id: -1,
                "recommendation_type_page_placement_id":this.recommendation_type_page_placement_id,
                "user_recommendation_id":-1,
                "recommendation_type_id": this.recommendation_type_id,
                 "page_name":pageName,
                  "status": status,
                  "label" :this.recommendation_type
              }
            }
          ]
        }
      }
      this.http.post<any>('http://127.0.0.1:8000/console/dashboard/recommendation_type_page_placement_post',{response:data} ).subscribe({
        next: data => {
          this.dialogRef.close(data);
        },
        error: error => {
          console.log(error);
          this.dialogRef.close(error);
        }
      })
    

    }
  }
  // getRecommendationTypePageData() {
  //   this.http.get<any>('http://127.0.0.1:8000/console/dashboard/recommendation_type').subscribe({
  //     next: data => {
  //      this.pageSettingsName = data.dataset;
  //     },
  //     error: error => {
  //       console.log(error);

  //     }
  //   })
  // }
  getRecommendationTypePageNames() {
    this.http.get<any>('http://127.0.0.1:8000/console/dashboard/page_name').subscribe({
      next: data => {
       this.pageNamesReccomendation = data.dataset;
      },
      error: error => {
        console.log(error);

      }
    })
  }

  getDemo(){
    this.http.get<any>('http://127.0.0.1:8000/console/dashboard/pagename_details/').subscribe({
      next: data => {
      //  this.pageNamesReccomendation = data.dataset;
    
      this.reccomendationData = data.dataset[0];

      let reccomendationDatalabels = this.reccomendationData.label;
   
     let newData :any =[];
     for (const key in reccomendationDatalabels) {
       newData.push({label : key , value : reccomendationDatalabels[key]})
   }
   this.reccomadationLabel = newData;
  
      this.recTypeOne = this.reccomendationData.str_value1;
      this.recTypeTwo = this.reccomendationData.str_value2;
      this.recTypeThree = this.reccomendationData.str_value3;
    
      



      },
      error: error => {
        console.log(error);

      }
    })
   
  }
  onchange(e){
    this.changeRef.detectChanges();
    let demo = e.value.value;
    this.recommendation_type_page_placement_id = demo[2];
    this.changeRef.detectChanges();
    if(demo[1] == "str_value1"){
      this.typeOne = true;
      this.typeTwo = false;
      this.typeThree = false;
      this.changeRef.detectChanges();
    }else if (demo[1] == "str_value2") { 
      this.typeOne = false;
      this.typeTwo = true;
      this.typeThree = false;
      this.changeRef.detectChanges();
    }else{ 
      this.typeOne = false;
      this.typeTwo = false;
      this.typeThree = true;
      this.changeRef.detectChanges();
    }
  }

  onchangeNew(e){
    let demo = e.value;
    this.recommendation_type = demo.recommendation_type;
    this.recommendation_type_id = demo.recommendation_type_id
  }
}

