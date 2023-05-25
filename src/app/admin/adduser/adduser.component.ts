import { Component, OnInit } from '@angular/core';
import { AdduserDailogComponent } from './adduser-dailog/adduser-dailog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss']
})
export class AdduserComponent implements OnInit {

  constructor(public dialog: MatDialog ,private http : HttpClient , ) { }

  ngOnInit(): void {
  }
  public openCategoryDialog(data:any){
    
    const dialogRef = this.dialog.open(AdduserDailogComponent, {
      data: {
        category: data,
      },
      panelClass: ['theme-dialog'],
    });
    dialogRef.afterClosed().subscribe(setting => { 
      if(setting){    
        // this.getsortData();
        // location.reload();
      }
    });
  }
}
