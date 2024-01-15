import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SortingDialogComponent } from './sorting-dialog/sorting-dialog.component';
import { HttpClient } from '@angular/common/http';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { ClickStreamService } from 'src/app/shared/services/click-stream.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.scss']
})
export class WithdrawalComponent implements OnInit {
  sortingData: any;
  // public withdrawal = [
  //   { id: 1, invoiceId: '#0045', orderIds: ['#2485', '#4152', '#8574'], storeId: 1, amount: 20, charges: 0, payment: 20, date: new Date(2020,1,15,10,45) },
  //   { id: 2, invoiceId: '#5288', orderIds: ['#7455'], storeId: 2, amount: 45, charges: 5, payment: 50, date: new Date(2020,3,20,12,15) },
  //   { id: 3, invoiceId: '#6318', orderIds: ['#6122','#8710'], storeId: 2, amount: 30, charges: 0, payment: 30, date: new Date(2020,4,5,18,25) }
  // ];
  // public stores = [
  //   { id: 1, name: 'Store 1' },
  //   { id: 2, name: 'Store 2' }
  // ];
  // public page: any;
  // public count = 6;

  constructor(public dialog: MatDialog, private auth: AuthService, private http: HttpClient, private clickService: ClickStreamService) { }

  ngOnInit(): void {
    this.getsortData();
  }


  public openCategoryDialog(data: any) {

    const dialogRef = this.dialog.open(SortingDialogComponent, {
      data: {
        category: data,
      },
      panelClass: ['theme-dialog'],
    });
    dialogRef.afterClosed().subscribe(setting => {
      if (setting != undefined) {
        if (setting.status_message == "Data already exist and retrived successfully") {
          const dialogRef = this.dialog.open(AlertDialogComponent, {
            width: "420px",
            data: {
              title: "Alert",
              message: "Sorting Already Exists"
            }
          });
        } else {
          this.getsortData();
          location.reload();
        }
      }
    });
  }
  getsortData() {
    // this.http.get<any>('http://127.0.0.1:8000/console/'+ this.clickService.getAdminOrgId() +'/dashboard/sorting_all').subscribe({
    //   next: data => {       
    //     this.sortingData =  data.dataset;
    //   },
    //   error: error => {
    //     console.log(error);

    //   }
    // })
    this.auth.sendHttpGet('http://127.0.0.1:8000/console/' + this.clickService.getAdminOrgId() + '/dashboard/sorting_all')
      .then((respData) => {
        this.sortingData = respData.datalist;
      }).catch((error) => { console.log(error) });
  }
  public remove(sort: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm Action",
        message: "Are you sure you want remove this category?"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.http.delete<any>('http://127.0.0.1:8000/console/dashboard/sorting_one/' + sort.sorting_id).subscribe({
          next: data => {
            this.getsortData();
            location.reload();
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

  changeStatus(setting) {

    let status;
    if (setting.status == true) {
      status = "false";

    } else {
      status = "true";
    }
    let data = {

      data_tables: [
        {
          table_name: "tb_sorting_type",
          data: {
            "sorting_id": setting.sorting_id,
            "sorting_label": setting.sorting_label,
            "sorting_felid": setting.sorting_felid,
            "order_id": 1,
            "status": status,

          }
        }
      ]
    }
    // this.http.post<any>('http://127.0.0.1:8000/console/dashboard/sorting_update',{response:data} ).subscribe({
    //   next: data => {

    //   this.getsortData();
    //   location.reload();
    //   },
    //   error: error => {
    //     console.log(error);

    //   }
    // })
    this.auth.sendHttpPost('http://127.0.0.1:8000/console/dashboard/sorting_update', data)
      .then((respData) => {
        this.getsortData();
        location.reload();

      }).catch((error) => { console.log(error) });
  }
}
