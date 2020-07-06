import { Component, OnInit, Pipe, PipeTransform, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { ErrorHandler } from '@angular/core'
import * as i18nIsoCountries from 'i18n-iso-countries'
import { DatePipe } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
declare var System: { import(uri: string): any }

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class ModalComponent implements OnInit {
  checked = false;
  quitting = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  countries;
  newsletter = false;
  bonusses = false;
  step_tags = [ 
    'Kies een gebruikersnaam', 'Aanvullende gegevens', 'Hoe kunnen wij je op de hoogte houden?'
  ];
  stepTitle = 'Kies een gebruikersnaam';
  state: string;
  completed: boolean = false;


  @ViewChild('stepper') stepper: MatStepper;


  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _formBuilder: FormBuilder,
    private errorHandler: ErrorHandler,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {

    Promise.all([
      System.import('i18n-iso-countries/langs/nl.json'),
    ]).then((modules: i18nIsoCountries.LocaleData[]) => {
      const nl = modules[0];
      i18nIsoCountries.registerLocale(nl)
      this.countries = nl.countries;
      
    }).catch(err => { this.errorHandler.handleError(err) })

    this.firstFormGroup = this._formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
      checked: [false, Validators.pattern('true')]
    });
    
    this.secondFormGroup = this._formBuilder.group({
      nationality: ['', Validators.required],
      date: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      bonusses: ['false',],
      newsletter: ['false',]
    });

  }
  

  changeStep(){
    this.stepTitle = this.step_tags[this.stepper.selectedIndex];
  }

  closeModal() {
    this.dialogRef.close();
  }

  toggleBonusses($event){
    this.bonusses = $event.checked;
  }

  toggleNewsletter($event){
    this.newsletter = $event.checked;
  }

  finishForm(){
    const email = this.data.email;
    const username = this.firstFormGroup.get('name').value;
    
    const nationality = this.secondFormGroup.get('nationality').value;
    const birthdate = this.datePipe.transform( this.secondFormGroup.get('date').value, 'dd-MM-yyyy');
    console.log(email, username, nationality, birthdate, this.bonusses, this.newsletter);

    const dialogResult = {'email': email, 'username': username, 'nationality': nationality, 'birthdate': birthdate, 'bonusses': this.bonusses, 'newsletter': this.newsletter};
    console.log(dialogResult);
    this.dialogRef.close(dialogResult);
  }

}
