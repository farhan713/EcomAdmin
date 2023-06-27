import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder ,Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClickStreamService } from 'src/app/shared/services/click-stream.service';
@Component({
  selector: 'app-style-settings',
  templateUrl: './style-settings.component.html',
  styleUrls: ['./style-settings.component.scss']
})
export class StyleSettingsComponent implements OnInit {
  settingsForm: FormGroup;
  constructor(private formBuilder: FormBuilder ,private http: HttpClient ,public snackBar: MatSnackBar ,private clickService: ClickStreamService) {}

  ngOnInit(): void {
    this.settingsForm = this.formBuilder.group({
      // color: ['', Validators.required],
      leftContentBG: ['', Validators.required],
      // productImageBG: ['', Validators.required],
      headerFontColor:['', Validators.required],
      contentFontColor: ['', Validators.required],
      seeAllButtonBG: ['', Validators.required],
      seeAllButtonFontColor: ['', Validators.required],
      headerSize: ['', Validators.required],
      headerFontWeight: ['', Validators.required],
      leftContentSize:['', Validators.required],
      leftContentFontWeight:['', Validators.required],
      rightContentSize: ['', Validators.required],
      rightContentFontWeight: ['', Validators.required],
      priceSize: ['', Validators.required],
      priceFontWeight: ['', Validators.required],
      cartButtonSize: ['', Validators.required],
      seeAllButtonSize: ['', Validators.required],
      seeAllButtonBorderWidth: ['', Validators.required],
      seeAllButtonBorderRadius: ['', Validators.required],
      headerUnderlineBorderWidth: ['', Validators.required],
      // productImageBorderRadius:['', Validators.required],
    });
    this.getOrgStylesDetails();
  }

  logFormData(): void {
    console.log(this.settingsForm.value);
  }
  onSubmit() {
    if (this.settingsForm.valid){
    let formValues = this.settingsForm.value;
    let data = {
      color: {
        left_content_bg: formValues.leftContentBG,
        right_content_bg:formValues.rightContentBG,
        // product_image_bg: formValues.productImageBG,
        header_font_color: formValues.headerFontColor,
        content_font_color: formValues.contentFontColor,
        see_all_button_bg: formValues.seeAllButtonBG,
        see_all_button_font_color: formValues.seeAllButtonFontColor,
      },
      font: {
        family: "Arial, sans-serif"
      },
      size: {
        header: { font_size: formValues.headerSize+'px', font_weight: formValues.headerFontWeight },
        left_content: { font_size: formValues.leftContentSize+'px', font_weight: formValues.leftContentFontWeight },
        right_content: { font_size: formValues.rightContentSize+'px', font_weight: formValues.rightContentFontWeight },
        // font_size: { font_size: formValues.rightContentSize+'px', font_weight: formValues.rightContentFontWeight },
        price:{ font_size: formValues.priceSize+'px', font_weight: formValues.priceFontWeight },
        cart_button_size: formValues.cartButtonSize+'px',
        see_all_button: { font_size: '14px', button_size: formValues.seeAllButtonSize+'px' }
      },
      styling: {
        see_all_button: { border_width: formValues.seeAllButtonBorderWidth+'px', border_radius: formValues.seeAllButtonBorderRadius+'px' },
        header_underline: { border_width: formValues.headerUnderlineBorderWidth+'px' },
        // product_image: { border_radius: formValues.productImageBorderRadius+'px' }
      }
    }
    
    console.log(formValues);
    this.http.post<any>('http://127.0.0.1:8000/console/'+this.clickService.getAdminOrgId()+'/search_ui_info',data ).subscribe({
      next: data => {
        this.snackBar.open('Settings are saved Successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
        setTimeout(()=>{
        this.getOrgStylesDetails();
        location.reload();
        },100)
      },
      error: error => {
        console.log(error);

      }
    })
  }
}

getOrgStylesDetails() {
  this.http.get<any>('http://127.0.0.1:8000/console/'+this.clickService.getAdminOrgId()+'/search_ui_styling_info').subscribe({
    next: data => {
      console.log(data,"hi")
      const formData = data.dataset[0];

      const removePx = (value: string): number => {
        return parseInt(value.replace('px', ''), 10);
      };
    
      this.settingsForm.patchValue({
        leftContentBG: formData.color.left_content_bg,
        // productImageBG: formData.color.product_image_bg,
        headerFontColor: formData.color.header_font_color,
        contentFontColor: formData.color.content_font_color,
        seeAllButtonBG: formData.color.see_all_button_bg,
        seeAllButtonFontColor: formData.color.see_all_button_font_color,
        headerSize: removePx(formData.size.header.font_size),
        headerFontWeight: formData.size.header.font_weight,
        leftContentSize: removePx(formData.size.left_content.font_size),
        leftContentFontWeight: formData.size.left_content.font_weight,
        rightContentSize: removePx(formData.size.right_content.font_size),
        rightContentFontWeight: formData.size.right_content.font_weight,
        priceSize: removePx(formData.size.price.font_size),
        priceFontWeight: formData.size.price.font_weight,
        cartButtonSize: removePx(formData.size.cart_button_size),
        seeAllButtonFontSize: removePx(formData.size.see_all_button.font_size),
        seeAllButtonSize: removePx(formData.size.see_all_button.button_size),
        seeAllButtonBorderWidth: removePx(formData.styling.see_all_button.border_width),
        seeAllButtonBorderRadius: removePx(formData.styling.see_all_button.border_radius),
        headerUnderlineBorderWidth: removePx(formData.styling.header_underline.border_width),
        // productImageBorderRadius: removePx(formData.styling.product_image.border_radius)
      });
    },
    error: error => {
      console.log(error);

    }
  })
}
}
