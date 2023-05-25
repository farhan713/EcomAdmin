import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { ClickStreamService } from 'src/app/shared/services/click-stream.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  public followers = [
    { id: 1, image: 'assets/images/profile/michael.jpg', name: 'Michael Blair', storeId: 1 },
    { id: 2, image: 'assets/images/profile/tereza.jpg', name: 'Tereza Stiles', storeId: 2 },
    { id: 3, image: 'assets/images/profile/adam.jpg', name: 'Adam Sandler', storeId: 1 },
    { id: 4, image: 'assets/images/profile/julia.jpg', name: 'Julia Aniston', storeId: 2 },
    { id: 5, image: 'assets/images/profile/bruno.jpg', name: 'Bruno Vespa', storeId: 2 },
    { id: 6, image: 'assets/images/profile/ashley.jpg', name: 'Ashley Ahlberg', storeId: 1 },
    { id: 7, image: 'assets/images/avatars/avatar-5.png', name: 'Michelle Ormond', storeId: 1 }
  ];
  public stores = [
    { id: 1, name: 'Store 1' },
    { id: 2, name: 'Store 2' }
  ];
  public page: any;
  public count = 6;
  zeroSearchResult: any = [];
  days = [
    1,7,15,30
  ]
  selectedDay = 1;
  constructor(public dialog: MatDialog, private http: HttpClient ,private clickService: ClickStreamService,) { }

  ngOnInit(): void {
    this.getZeroSearchResult();
  }

  public onPageChanged(event){
    this.page = event; 
    window.scrollTo(0,0); 
  }

  public remove(follower:any){  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm Action",
        message: "Are you sure you want remove this follower?"
      }
    }); 
    dialogRef.afterClosed().subscribe(dialogResult => { 
      if(dialogResult){
        const index: number = this.followers.indexOf(follower);
        if (index !== -1) {
          this.followers.splice(index, 1);  
        } 
      } 
    }); 
  }

  public getZeroSearchResult(){
    this.http.get<any>('http://127.0.0.1:8000/console/'+this.clickService.getAdminOrgId()+'/zero_search_queries/' + this.selectedDay).subscribe({
      next: data => {
        this.zeroSearchResult = data.dataset;
        console.log(this.zeroSearchResult,"aniket code here");
        
    
      }
    });
  }
}
