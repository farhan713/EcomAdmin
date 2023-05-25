import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from '../../products/categories/category-dialog/category-dialog.component';
import { AppSettings, Settings } from 'src/app/app.settings';
import { CreateOrgnizationComponent } from '../create-orgnization/create-orgnization.component';
import { HttpClient } from '@angular/common/http';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  public orders = [
    { number: '#3258', date: 'March 29, 2018', status: 'Completed', total: '$140.00 for 2 items', invoice: true },
    { number: '#3145', date: 'February 14, 2018', status: 'On hold', total: '$255.99 for 1 item', invoice: false },
    { number: '#2972', date: 'January 7, 2018', status: 'Processing', total: '$255.99 for 1 item', invoice: true },
    { number: '#2971', date: 'January 5, 2018', status: 'Completed', total: '$73.00 for 1 item', invoice: true },
    { number: '#1981', date: 'December 24, 2017', status: 'Pending Payment', total: '$285.00 for 2 items', invoice: false },
    { number: '#1781', date: 'September 3, 2017', status: 'Refunded', total: '$49.00 for 2 items', invoice: false }, 
    { number: '#3981', date: 'December 24, 2017', status: 'Pending Payment', total: '$285.00 for 2 items', invoice: false },
    { number: '#5781', date: 'September 3, 2017', status: 'Refunded', total: '$49.00 for 2 items', invoice: false },
    { number: '#6258', date: 'March 22, 2019', status: 'Completed', total: '$140.00 for 2 items', invoice: true },
    { number: '#7145', date: 'February 14, 2020', status: 'On hold', total: '$255.99 for 1 item', invoice: false },
    { number: '#1972', date: 'January 10, 2018', status: 'Processing', total: '$255.99 for 1 item', invoice: true },
    { number: '#8971', date: 'October 3, 2019', status: 'Completed', total: '$73.00 for 1 item', invoice: true }
  ]
  public page: any;
  public count = 6;
  public settings:Settings;
  orgnizationData: any;
  constructor( public dialog: MatDialog, public appSettings:AppSettings ,private http: HttpClient) {
    this.settings = this.appSettings.settings;
   }

  ngOnInit(): void {
    this.getOrgdata()
  }

  public onPageChanged(event){
    this.page = event; 
    window.scrollTo(0,0); 
  }
  public CreateOrgnization(data:any){
    const dialogRef = this.dialog.open(CreateOrgnizationComponent, {
      data: {
        data: data,
       
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: (this.settings.rtl) ? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(setting => { 
      if(setting){ 
           
        this.getOrgdata();
        location.reload();
         }
    });
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

  changeStatus(setting) {
    let status ;
      if(setting.status == true){
         status = "false";
       
      }else{
        status = "true";
      }
    let  data = {
         
        data_tables: [
          {
            table_name: "tb_organization",
            data: {
              "org_id": setting.org_id,
              "org_name": setting.org_name,
              "status": status
            }
          }
        ]
      }
      this.http.post<any>('http://127.0.0.1:8000/console/organization',{response:data} ).subscribe({
        next: data => {
        this.getOrgdata();
        location.reload();
   
        },
        error: error => {
          console.log(error);
  
        }
      })
  }
  public remove(category:any){  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm Action",
        message: "Are you sure you want remove this Orgnization?"
      }
    }); 
    dialogRef.afterClosed().subscribe(dialogResult => { 
      if(dialogResult){
      this.http.delete<any>('http://127.0.0.1:8000/console/organization/'+category.org_id).subscribe({
      next: data => {
        // this.getOrgdata();
        // location.reload();
        
      },
      error: error => {
        console.log(error);

      }
    })
     
          // const index: number = this.categories.indexOf(category);
        // if (index !== -1) {
        //   this.categories.splice(index, 1);  
        // } 
      } 
    }); 
  }
}
