import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { PurchaseFormService } from 'src/app/services/purchase-form.service';
import { CheckoutValidators } from 'src/app/validators/checkout-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [] ;
  creditCardMonths: number[] = [] ;

  countries: Country[] = [];

  shippingAddressState: State[] = [];
  billingAddressState: State[] = [];

  
  constructor(private formBuilder: FormBuilder,
              private purchaseFormService: PurchaseFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',[Validators.required,Validators.minLength(2),CheckoutValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('',[Validators.required,Validators.minLength(2),CheckoutValidators.notOnlyWhiteSpace]),
        email: new FormControl('',[Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAdress: this.formBuilder.group({
        country: [''],
        street: [''],
        state: [''],
        city: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        state: [''],
        city: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        cardName: [''],
        cardNumber: [''],
        securityCode: [''],
        expiartionMonth: [''],
        expirationYear: ['']
      }),
    });

    // populate credit card months

    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.purchaseFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months : " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )

    // populate credit card years
      this.purchaseFormService.getCreditCardYears().subscribe(
        data => {
          console.log(" Retrieve card credit years: " + JSON.stringify(data));
          this.creditCardYears = data;
        }
      )

      
      this.purchaseFormService.getCountries().subscribe(
        data => {
          console.log("retrieved countries : "+ JSON.stringify(data));
          this.countries = data;
        }
  );

  }
  onSubmit(){

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("The email address is "+ this.checkoutFormGroup.get('customer').value.email);

    console.log("The shipping address country is  "+ this.checkoutFormGroup.get('shippingAdress').value.country.name);
    console.log("The shipping address state is "+ this.checkoutFormGroup.get('shippingAdress').value.state.name);

  }

  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}

  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}

  get email(){return this.checkoutFormGroup.get('customer.email');}


  copyShippingAddressToBillingAddress(event){
    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress
      .setValue(this.checkoutFormGroup.controls.shippingAdress.value);

      // bug fix code where states were not imported on check box
      this.billingAddressState = this.shippingAddressState;

    }
    else{
      this.checkoutFormGroup.controls.billingAddress.reset();

      //bug fix

      this.billingAddressState = [];
    }

  }

  handleMonthsAndYears(){

    // get reference to our form group

    const creditCardFormGrou = this.checkoutFormGroup.get('creditCard');

    const currentYear : number = new Date().getFullYear();
    const selectedYear : number = Number(creditCardFormGrou.value.expirationYear);

    // check if current year = selected year
    let startMonth: number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    }
    else{
      startMonth = 1;
    }

    this.purchaseFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("retrieved card credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

  }

  getStates(formGroupName: string){

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`)
    console.log(`${formGroupName} country name: ${countryName}`)

    this.purchaseFormService.getStates(countryCode).pipe().subscribe(
      data => {
        if(formGroupName === 'shippingAdress'){
          this.shippingAddressState = data;
        }
        else{
          this.billingAddressState = data;
        }

        // select first state as default
        formGroup.get('state').setValue(data[0]);
      }
    );
  }
}
