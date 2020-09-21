import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { VariationService } from '../../services/variation.service';
import { StockService } from '../../services/stock.service';
import {Product, CalculateTotalClassPipe, Stock, Variant, Business } from '@enexus/flipper-components';
import { DialogService, DialogSize } from '@enexus/flipper-dialog';
import { AddVariantComponent } from '../add-variant/add-variant.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'flipper-regular-variants',
  templateUrl: './regular-variants.component.html',
  styleUrls: ['../../create-product/create-product.component.css',
               './regular-variants.component.css']
})
export class RegularVariantsComponent implements OnInit {
  isFocused = '';
  item: Product;
  regularVariant: Variant;
  form: FormGroup;
  business:Business;
  @Input('product')
  set product(item: Product) {
  this.item = item;
  }
  get product(): Product {
  return this.item;
  }
  stocks:Stock[]=[];
  currentStock:number=0;
  lowStock:number=0;

  @Input('regularVariantion')
  set regularVariantion(item: Variant) {
  this.regularVariant = item;
  }
  get regularVariantion(): Variant {
  return this.regularVariant;
  }
  //defaultBusiness
  @Input('defaultBusiness')
  set defaultBusiness(item: Business) {
  this.business = item;
  }
  get defaultBusiness(): Business {
  return this.business;
  }
  constructor(private dialog: DialogService, public variant: VariationService,
              public stock: StockService,
              private formBuilder: FormBuilder,
              private totalPipe: CalculateTotalClassPipe) {
           
               }

   ngOnInit() {
 
      this.stock.variantStocks(this.regularVariantion.id).then(res=>{
        this.stocks=res.docs;
      });
      
      this.currentStock= this.getTotalStock(this.regularVariantion.id, 'currentStock');
      this.lowStock=this.getTotalStock(this.regularVariantion.id, 'lowStock');
        this.request(null, this.regularVariantion);
     
  }
  

  public openAddVariantDialog(product: Product): any {
    return this.dialog.open(AddVariantComponent, DialogSize.SIZE_MD, product).subscribe(result => {
      if (result === 'done') {
        this.variant.init(product);
      }
      this.variant.init(product);
    });
  }
 
   request(action = null, variant = null) {

     if(variant!==null || variant!==undefined){

    const stock: Stock = this.stocks.length > 0?this.stocks[0]:null;

    this.form =  this.formBuilder.group({
      name: [!action && variant && variant.name ? variant.name : '', Validators.required],
      SKU: !action && variant && variant.SKU ? variant.SKU : this.variant.generateSKU(),
      retailPrice: [!action && variant && stock ? stock.retailPrice : 0.00, Validators.min(0)],
      supplyPrice: [!action && variant && stock ? stock.supplyPrice : 0.00, Validators.min(0)],
      unit: !action && variant && variant.unit ? variant.unit : '',
      createdAt: new Date(),
      updatedAt: new Date(),

    });

  }

  }


  updateVariant(key: any, event: any) {

       this.variant.updateVariant(key, this.regularVariantion, event);
  }
  get formControl() { return this.form.controls; }
  focusing(value) {
    this.isFocused = value;

    if (value === 'retailPrice') {
      this.form.controls.retailPrice.setValue('');
    } else if (value === 'supplyPrice') {
      this.form.controls.supplyPrice.setValue('');
    } else if (value === 'SKU') {
      this.form.controls.SKU.setValue('');
    }
  }

   getTotalStock(variantId, key: any):number {

   console.table(this.stocks);
    if (this.stocks.length > 0) {
          return this.totalPipe.transform(this.stocks, key);
    } else {
        return 0;
    }
  }

  async focusingOut() {

    await this.stock.findVariantStock(this.regularVariantion.id);
    const stock = this.stock.stock;

      if (this.isFocused === 'retailPrice' && (this.form.controls.retailPrice.value === 0 ||
        this.form.controls.retailPrice.value === '')) {
        this.form.controls.retailPrice.setValue(stock.retailPrice ? stock.retailPrice : 0);
        }
      if (this.isFocused === 'supplyPrice' && (this.form.controls.supplyPrice.value === 0 ||
        this.form.controls.supplyPrice.value === '')) {
          this.form.controls.supplyPrice.setValue(stock.supplyPrice ? stock.supplyPrice : 0);
        }

      if (this.isFocused === 'SKU' && (this.form.controls.SKU.value === 0 ||
        this.form.controls.SKU.value === '')) {
          this.form.controls.SKU.setValue(this.regularVariantion.SKU);
        }


       this.isFocused = '';

  }



}
