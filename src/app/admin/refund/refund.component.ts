import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClickStreamService } from 'src/app/shared/services/click-stream.service';
@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.scss']
})
export class RefundComponent implements OnInit {
  data: any;
  isPersonalized: boolean = true;
  personalizedData: any;
  nonPersonalizedData;
  selectedValue = 'Personalized';
  selectedDay = '1';
  constructor( private http: HttpClient , private loader : NgxSpinnerService ,private clickService: ClickStreamService) { }

  ngOnInit(): void {
    this.getRecomandationData(1)
  }
getRecomandationData(day) {
  this.loader.show()
  this.http.get<any>('http://127.0.0.1:8000/console/'+this.clickService.getAdminOrgId()+'/dashboard/calculation_user_recommendation_activity/' +day).subscribe({
    next: data => {
    console.log(data ,"hii")   
    this.personalizedData = data.dataset.Personalized
    this.nonPersonalizedData = data.dataset.NonPersonalized;
      this.loader.hide()
    },
    error: error => {
      console.log(error);
      this.loader.hide()
    }
  })
}
changeData(val){
  console.log(val)
  if(val == 'Personalized'){
    this.isPersonalized = true;
  }else{
    this.isPersonalized = false;
  }
 console.log( this.isPersonalized)
}
removeUnderscore(text: string): string {
  return text.replace(/_/g, ' ');
}
}
