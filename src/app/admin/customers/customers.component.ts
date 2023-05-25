import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomerDialogComponent } from './customer-dialog/customer-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { customers } from './customers';
import { AppSettings, Settings } from 'src/app/app.settings';
import { HttpClient } from '@angular/common/http';
import { log } from 'console';
import { ClickStreamService } from 'src/app/shared/services/click-stream.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  public customers = [];
  synonymsData: any = [];
  public stores = [
    { id: 1, name: 'Store 1' },
    { id: 2, name: 'Store 2' }
  ]
  public countries = [];
  public page: any;
  public count = 6;
  public settings: Settings;
  constructor(public appService: AppService, public dialog: MatDialog, public appSettings: AppSettings, private http: HttpClient, private clickService: ClickStreamService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.countries = this.appService.getCountries();
    this.customers = customers;
    this.synonyms_getcall();
  }

  public onPageChanged(event) {
    this.page = event;
    window.scrollTo(0, 0);
  }

  public openCustomerDialog(data: any) {
    console.log(data, "gfgfg")
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      data: data,
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: (this.settings.rtl) ? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(customer => {
      if(customer){
        this.synonyms_getcall();
        location.reload();
      }
      if (customer) {
        const index: number = this.customers.findIndex(x => x.id == customer.id);
        if (index !== -1) {
          this.customers[index] = customer;
        }
        else {
          let last_customer = this.customers[this.customers.length - 1];
          customer.id = last_customer.id + 1;
          this.customers.push(customer);
        }
      }
    });
  }
  public synonyms_getcall() {
    this.http.get<any>('http://127.0.0.1:8000/console/'+this.clickService.getAdminOrgId()+'/dashboard/search_synonyms_all/' + '1').subscribe({
      next: data => {
        this.synonymsData = data;
        console.log(this.synonymsData);
        // this.synonymsData.forEach((element) => {
        //   if (element.status == 'Active') {
        //     element['isChecked'] = true;
        //   } else {
        //     element['isChecked'] = false;
        //   }

        // });
        console.log(this.synonymsData, "checked");
      }
    });
  }
  public remove(Synonym: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm Action",
        message: "Are you sure you want remove this customer?"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      // if(dialogResult){
      //   const index: number = this.customers.indexOf(customer);
      //   if (index !== -1) {
      //     this.customers.splice(index, 1);  
      //   } 
      // } 
      if (dialogResult) {
        let deleteId = Synonym.synonyms_id;
        this.http.delete<any>('http://127.0.0.1:8000/console/'+this.clickService.getAdminOrgId()+'/dashboard/search_synonyms_one/' + deleteId).subscribe({
          next: data => {
            this.synonyms_getcall();
           location.reload();
          },
          error: error => {
            console.log(error);

          }
        });
        this.synonyms_getcall();
        location.reload();
      }
    });
  }
  changeStatus(Synonym) {
    let status ;
    if(Synonym.status == true){
       status = "false";
     
    }else{
      status = "true";
    }
    let data = {
      data_tables: [
        {
          table_name: "tb_search_synonyms",
          data: {

            org_id: Synonym.org_id,
            store_id: Synonym.store_id,
            synonyms_id: Synonym.synonyms_id,
            synonyms_type_id: Synonym.synonyms_type_id,
            synonyms: Synonym.synonyms,
            searching_string: "",
            mapped_result_keywords: "",
            status: status
          }

        }
      ]
    }
    this.http.post<any>('http://127.0.0.1:8000/console/dashboard/search_synonyms_update', { response: data }).subscribe({
      next: data => {
        this.synonyms_getcall();
         location.reload();
      },
      error: error => {
        console.log(error);

      }
    })
  }

}
