import {AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SOUTH_AFRICAN_LANGUAGES } from '../../../../../../../constants/south-african-languages';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CaseDetails } from '../../../../models/CaseDetails';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import { ActivatedRoute } from '@angular/router';
import { CaseDataService } from '../../../../services/case-data-service/case-data.service';

@Component({
  selector: 'app-caller',
  standalone: false,
  templateUrl: './caller.component.html',
  styleUrl: './caller.component.css',
})
export class CallerComponent implements OnInit {
  languages = SOUTH_AFRICAN_LANGUAGES;
  caseRef!: string;
  callerName: string = '';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  activeTab: string = 'caller';
  callerForm!: FormGroup;
  caseData: CaseDetails | null = null;

  client: string = '';
  serviceTypes: string[] = ['Service A', 'Service B', 'Service C'];
  agents: any;
  callOpenDates: any;
  today: any;

  separateDialCode = false;
  SearchCountryField = [SearchCountryField.Name, SearchCountryField.Iso2];
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.SouthAfrica,
    CountryISO.UnitedStates,
  ];
  phoneForm = new FormGroup({
    phone: new FormControl(undefined, [Validators.required]),
  });

  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }
  // phoneForm!: FormGroup;
  searchFields = [
    SearchCountryField.Name,
    SearchCountryField.DialCode,
    SearchCountryField.Iso2,
  ];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private caseDataService: CaseDataService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.caseRef = params.get('callRef') ?? '';
      this.callerName = params.get('callerName') ?? '';
      this.client = params.get('client') ?? '';
    });
    this.callerForm = this.fb.group({
      client: [''],
      serviceType: [''],
      consent: [''],
      firstName: [''],
      secondName: [''],
      callbackNumber: [''],
      cellNumber:[''],
      isPolicyHolder: [''],
      agent: [''],
      callOpenDate: [''],
      language: [''],
      refGiven: [''],
    });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  onSubmit(): void {
    if (this.callerForm.valid) {
      console.log(this.callerForm.value);
    }
  }

  getYearRange() {
    throw new Error('Method not implemented.');
  }
}
