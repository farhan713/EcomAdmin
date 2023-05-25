import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-adduser-dailog',
  templateUrl: './adduser-dailog.component.html',
  styleUrls: ['./adduser-dailog.component.scss']
})
export class AdduserDailogComponent implements OnInit {
  public form: FormGroup;
  sortingLabel: any;
  sortingData: any;
  sortTypeInt: any;
  sortTypeString: any;
  keys: string[];
 
  constructor(public dialogRef: MatDialogRef<AdduserDailogComponent> ,public fb: FormBuilder , private http : HttpClient ,   @Inject(MAT_DIALOG_DATA) public data: any ,private changeRef : ChangeDetectorRef) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      sorting_id: [null, Validators.required],
      status: false,
      sorting_felid: [null, Validators.required]
    }); 
  }

}
