import { Component, OnInit } from '@angular/core';
import { CreateStoreComponent } from '../create-store/create-store.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  public transactions = [
    { orderId: '#2121', transactionId: '#78245214510', date: 'March 29, 2018', paymentMethod: 'Stripe', status: 'Process', amount: '$140.00' },
    { orderId: '#7255', transactionId: '#58272854525', date: 'January 7, 2018', paymentMethod: 'Paypal', status: 'Pending', amount: '$855.00' },
    { orderId: '#4122', transactionId: '#48266987452', date: 'December 24, 2017', paymentMethod: 'Paypal', status: 'Delivered', amount: '$420.00' },
    { orderId: '#4534', transactionId: '#43567578223', date: 'March 29, 2018', paymentMethod: 'Stripe', status: 'Process', amount: '$140.00' },
    { orderId: '#6512', transactionId: '#54129964355', date: 'October 7, 2018', paymentMethod: 'Paypal', status: 'Pending', amount: '$952.00' },
    { orderId: '#2345', transactionId: '#75208924544', date: 'December 24, 2017', paymentMethod: 'Stripe', status: 'Delivered', amount: '$45.00' },
    { orderId: '#1255', transactionId: '#72113456734', date: 'October 2, 2019', paymentMethod: 'Stripe', status: 'Delivered', amount: '$140.00' },
    { orderId: '#8854', transactionId: '#96455673452', date: 'January 7, 2018', paymentMethod: 'Paypal', status: 'Pending', amount: '$225.00' },
    { orderId: '#9712', transactionId: '#85643112647', date: 'December 24, 2017', paymentMethod: 'Stripe', status: 'Delivered', amount: '$540.00' },
    { orderId: '#7342', transactionId: '#95534768943', date: 'March 29, 2018', paymentMethod: 'Stripe', status: 'Pending', amount: '$140.00' },
    { orderId: '#5414', transactionId: '#34861354666', date: 'October 7, 2018', paymentMethod: 'Paypal', status: 'Pending', amount: '$475.00' },
    { orderId: '#8906', transactionId: '#23756748667', date: 'November 2, 2017', paymentMethod: 'Paypal', status: 'Delivered', amount: '$420.00' }
  ]
  public page: any;
  public count = 6;
  storeData: any;

  constructor(public dialog: MatDialog ,private http: HttpClient) { }

  ngOnInit(): void {
    this.getStoreData()

  }

  public onPageChanged(event){
    this.page = event; 
    window.scrollTo(0,0); 
  }
  public createStore(data:any){
    const dialogRef = this.dialog.open(CreateStoreComponent, {
      data: {
        data: data,
       
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      // direction: (this.settings.rtl) ? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(setting => { 
      if(setting){    
        this.getStoreData();
        location.reload();
         }
    });
  }



  getStoreData() {
    this.http.get<any>('http://127.0.0.1:8000/console/all_store_data').subscribe({
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
       this.storeData = tempData;
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
     let data = {
         
        data_tables: [
          {
            table_name: "tb_store",
            data: {
              "org_id": setting.org_id,
              "store_no": setting.store_no,
              "store_name": setting.store_name,
              "status": status
            }
          }
        ]
      }
      this.http.post<any>('http://127.0.0.1:8000/console/store',{response:data} ).subscribe({
        next: data => {
        this.getStoreData();
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
        message: "Are you sure you want remove this Store?"
      }
    }); 
    dialogRef.afterClosed().subscribe(dialogResult => { 
      if(dialogResult){
      this.http.delete<any>('http://127.0.0.1:8000/console/store/'+category.store_no).subscribe({
      next: data => {
        this.getStoreData();
        location.reload();
        
      },
      error: error => {
        console.log(error);

      }
    })

      } 
    }); 
  }


}
