import { Component } from '@angular/core';
import { refunds } from '../analytics.data';

@Component({
  selector: 'app-refunds',
  templateUrl: './refunds.component.html',
  styleUrls: ['./refunds.component.scss']
})
export class RefundsComponent {
  public refunds: any[]; 
  public showLegend = true;
  public gradient = true;
  view: any[] = [278, 300];
  single = [
    {
      "name": "Germany",
      "value": 75
    }
  ];
  public colorScheme = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#F47B00', '#606060']
  }; 
  colorScheme1 = {
    domain: ['#C7B42C','#5AA454', '#A10A28', '#C7B42C']
  };
  public showLabels = true;
  public explodeSlices = false;
  public doughnut = false; 

  constructor() { 
    Object.assign(this, {refunds}); 
  }
  
  public onSelect(event) {
    console.log(event);
  }

}
