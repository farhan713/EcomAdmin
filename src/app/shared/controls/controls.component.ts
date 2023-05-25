
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Data, AppService } from '../../app.service';
import { Product } from '../../app.models';
import { ClickStreamService } from '../services/click-stream.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'] 
})
export class ControlsComponent implements OnInit {
  @Input() product: Product;
  @Input() type: string;
  @Output() onOpenProductDialog: EventEmitter<any> = new EventEmitter();
  @Output() onQuantityChange: EventEmitter<any> = new EventEmitter<any>();
  public count:number = 1;
  public align = 'center center';
  constructor(public appService:AppService, public snackBar: MatSnackBar,
    private clickService: ClickStreamService) { }

  ngOnInit() {
    if(this.product){
      if(this.product.cartCount > 0){
        this.count = this.product.cartCount;
      }
    }  
    this.layoutAlign(); 
  }

  public layoutAlign(){
    if(this.type == 'all'){
      this.align = 'space-between center';
    }
    else if(this.type == 'wish'){
      this.align = 'start center';
    }
    else{
      this.align = 'center center';
    }
  }



  public increment(count){
    if(this.count < this.product.availibilityCount){
      this.count++;
      let obj = {
        productId: this.product.id,
        soldQuantity: this.count,
        total: this.count * this.product.newPrice
      }
      this.changeQuantity(obj);
    }
    else{
      this.snackBar.open('You can not choose more items than available. In stock ' + this.count + ' items.', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
    }    
  }

  public decrement(count){
    if(this.count > 1){
      this.count--;
      let obj = {
        productId: this.product.id,
        soldQuantity: this.count,
        total: this.count * this.product.newPrice
      }
      this.changeQuantity(obj);
    }
  }

  public addToCompare(product:Product){
    // console.log(product);PRODUCT_COMPARE
    this.clickService.sendMessage({ "event": "clicked", "eventType": "PRODUCT_COMPARE" ,"productId" : product.id });
    this.appService.addToCompare(product);
  }

  public addToWishList(product:Product){
    this.clickService.sendMessage({ "event": "clicked", "eventType": "ADD_TO_LIST" ,"productId" : product.id });
    this.appService.addToWishList(product);
  }

  public addToCart(product:any){
    // console.log(product)
    let currentProduct = this.appService.Data.cartList.filter(item=>item.id == product.id)[0];
    console.log(currentProduct);
    console.log(this.product);
    
    this.clickService.sendMessage({ "event": "clicked", "eventType": "PRODUCT_SAVED" ,"productId" : product.id });
    if(currentProduct){
      if((currentProduct.cartCount + this.count) <= this.product.availibilityCount){
        product.cartCount = currentProduct.cartCount + this.count;
      }
      else{
        this.snackBar.open('You can not add more items than available. In stock ' + this.product.availibilityCount + ' items and you already added ' + currentProduct.cartCount + ' item to your cart', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
        return false;
      }
    }
    else{
      product.cartCount = this.count;
    }       
    let pageName;
    if(product.pageName) {
      pageName = product.pageName
    } else {
      pageName = "";
    }
    this.clickService.updateProductTrack("product",product.id);
    this.clickService.updateProductTrack("from",product.clickValue);
    this.clickService.updateProductTrack("user_recommendation_id",product.user_recommendation_id);
    this.clickService.updateProductTrack("pageName",pageName);
    this.clickService.updateProductTrack("recommendation_type_id",product.recommendation_type_id);
    this.clickService.updateProductTrack("lastscreen","home");
    this.clickService.updateProductTrack("currentScreen","products");
    // this.clickService.updateProductTrack("sku_ids",this.currentVisibleproducts);
    this.clickService.updateProductTrack("query",product.query);
    this.appService.addToCart(product);
  }

  public openProductDialog(event){
    this.clickService.sendMessage({ "event": "clicked", "eventType": "REVIEW_IMAGE_VIEWED" ,"productId" : event.product_id });
    this.onOpenProductDialog.emit(event);
  }

  public changeQuantity(value){
      this.onQuantityChange.emit(value);
  }

}
