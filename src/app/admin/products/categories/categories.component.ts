
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Category } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AppSettings, Settings } from 'src/app/app.settings';
import { HttpClient } from '@angular/common/http';

import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClickStreamService } from 'src/app/shared/services/click-stream.service';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  public categories:Category[] = []; 
  public settingList:any = [];
  public page: any;
  public count = 6;
  public settings:Settings;
  pageSettingData: any;
  reccomendationData: any =[];


  addTocartData: any;
  checkOutPageData: any;
  homePageData: any;
  orderConfirmationData: any;
  productPageData: any;
  constructor(public appService: AppService, public dialog: MatDialog, public appSettings:AppSettings
    ,   private http: HttpClient , private loader : NgxSpinnerService , private clickService: ClickStreamService ,private changeRef : ChangeDetectorRef
    
    ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
   
    this.getReccomandationData();
  }
  // ngDoCheck(){
  //   this.getReccomandationData()
  // }
  getReccomandationData(){
    this.loader.show();
    this.http.get<any>('http://127.0.0.1:8000/console/'+this.clickService.getAdminOrgId()+'/dashboard/pagename_details/').subscribe({
      next: data => {
      // this.reccomendationData = data.dataset;
        let tempData:any= [] = data.dataset;
   
        tempData.forEach((page) => {
          for (const recommendation of Object.values(page)) {
            (recommendation as Array<any>).forEach((rec) => {
              if(rec.status === 'true' || rec.status === true ){
                rec.status = true
                this.changeRef.detectChanges();
              
              }else{
             
                rec.status = false;
                this.changeRef.detectChanges();

              }
            });
          }
        });
       setTimeout(()=>{
        this.reccomendationData = tempData;
       },100)
       this.loader.hide();
     
      },
      error: error => {
       this.loader.hide();

        console.log(error);

      }
    })
   
  }
  changeStatusViaToggle(e ,userRecid) {
  
    let status ;
      if(e.checked){
         status = "true";
       
      }else{
        status = "false";
      }
     
       let  data = {
         
        data_tables: [
          {
            table_name: "tb_recommendation_type_page_placement",
            data: {
              org_id: this.clickService.getAdminOrgId(),
              store_id: -1,
              "user_recommendation_id":userRecid,
                "status":status,
            }
          }
        ]
      }
      this.http.post<any>('http://127.0.0.1:8000/console/dashboard/recommendation_type_page_placement_post',{response:data} ).subscribe({
        next: data => {
        this.getReccomandationData();
        // location.reload();
   
        },
        error: error => {
          console.log(error);
          this.loader.hide()
        }
      })
  }
  public onPageChanged(event){
    this.page = event; 
    window.scrollTo(0,0); 
  }
  ngOnDestroy() {
    this.reccomendationData = [];
  }

  removeUnderscore(text: string): string {
    return text.replace(/_/g, ' ');
  }
 
}

