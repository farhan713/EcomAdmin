import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ClickStreamService } from '../services/click-stream.service';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit {
  @Input('banners') banners: Array<any> = [];

  constructor(public router:Router,
    private clickService: ClickStreamService,) { }

  ngOnInit() { }

  public getBanner(index){
   
    return this.banners[index];
  }

  public getBgImage(index){
    let bgImage = {
      'background-image': index != null ? "url(" + this.banners[index].image + ")" : "url(https://via.placeholder.com/600x400/ff0000/fff/)"
    };
    return bgImage;
  } 
  onShopNow(product){
    // console.log("on  products/electronics" ,product);
    this.clickService.updateProductTrack("from","Top Categories");
    this.clickService.updateProductTrack("lastscreen","home");
    this.clickService.updateProductTrack("currentScreen","products");
    this.clickService.sendMessage({ "event": "click", "eventType": "SEARCHED_KEYWORD" });
    this.router.navigate(['/products',product.title ]); 
    
  }
}
