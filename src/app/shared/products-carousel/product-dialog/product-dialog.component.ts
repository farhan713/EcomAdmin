import { Component, ViewEncapsulation, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Data, AppService } from '../../../app.service';
import { Product } from '../../../app.models';
import { TimeAndVisitsTrackerService } from 'src/app/shared/services/time-and-visits-tracker.service';
import { Subscription } from 'rxjs';
import { ClickStreamService } from '../../services/click-stream.service';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductDialogComponent implements OnInit {
  public config: SwiperConfigInterface = {};
  private dataSubscription: Subscription;
  elapsedTime: number;
  pageVisits: Map<string, number>;
  constructor(public appService:AppService, 
              public dialogRef: MatDialogRef<ProductDialogComponent>,
              private timeAndVisitTracker : TimeAndVisitsTrackerService,
              @Inject(MAT_DIALOG_DATA) public product: Product ,private clickService: ClickStreamService) { }

  ngOnInit() {
    console.log("in on init");
    this.timeAndVisitTracker.startTracking();
    let seconds;
    let isSendMsg = true;
    this.dataSubscription = this.timeAndVisitTracker.getData().subscribe(data => {
      this.elapsedTime = data.elapsedTime;
      this.pageVisits = data.pageVisits;
      seconds = this.elapsedTime / 10000;
        if(seconds >= 2 && isSendMsg){
          isSendMsg = false;
          this.clickService.sendMessage({ "event": "clicked", "eventType": "REVIEW_IMAGE_VIEWED" ,"productId" : this.product.id });
        }
    });
   }

  ngAfterViewInit(){
    this.config = {
      slidesPerView: 1,
      spaceBetween: 0,         
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,        
      loop: false,
      preloadImages: false,
      lazy: true, 
      effect: "fade",
      fadeEffect: {
        crossFade: true
      }
    }
  }

  public close(): void {
    this.dialogRef.close();
    // this.timeAndVisitTracker.trackData.unsubscribe();
    // this.timeAndVisitTracker.stopTracking()
  }
  ngOnDestroy() {
    this.timeAndVisitTracker.stopTracking();
    this.dataSubscription.unsubscribe();
  }
}