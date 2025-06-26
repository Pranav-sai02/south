import { Component, OnInit } from '@angular/core';
import { SOUTH_AFRICAN_LANGUAGES } from '../../../../../../constants/south-african-languages';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CaseDetails } from '../../../models/CaseDetails';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ActivatedRoute } from '@angular/router';
import { CaseDataService } from '../../../services/case-data-service/case-data.service';
import { MatStepper } from '@angular/material/stepper';
import { AddPhase1Component } from '../tab-components/add-phase1/add-phase1.component';
import { AddPhase2Component } from '../tab-components/add-phase2/add-phase2.component';
import { AddPhase3Component } from '../tab-components/add-phase3/add-phase3.component';
import { BreadcrumbService } from '../../../../../../layouts/breadcrumb/service/breadcrumb.service';

@Component({
  selector: 'app-case-details',
  standalone: false,
  templateUrl: './case-details.component.html',
  styleUrl: './case-details.component.css'
})
export class CaseDetailsComponent implements OnInit {



 languages = SOUTH_AFRICAN_LANGUAGES;
  caseRef!: string;
  callerName: string = '';
  activeTab: string = 'caller'; // default tab
  client: string = '';
  callerForm!: FormGroup;
  caseData: CaseDetails | null = null;

  agents: any;
  callOpenDates: any;
  today: any;

  // Stepper configuration
  // isLinear: boolean = true;
  // activeIndex: number = 0;
  // completedSteps: boolean[] = [false, false, false, false, false];

  // tabs = [
  //   { label: 'Caller' },
  //   { label: 'Validation' },
  //   { label: 'Voucher/SMS' },
  //   { label: 'Complaints' },
  //   { label: 'Documents' },
  //   { label: 'Add Phase 1', component: AddPhase1Component },
  //   { label: 'Add Phase 1', component: AddPhase2Component },
  //   { label: 'Add Phase 1', component: AddPhase3Component },
  // ];

  selectedTab = 0;

  selectTab(index: number) {
    this.selectedTab = index;
  }

  // List of clients for the dropdown
  clients: string[] = ['AUL-FUNER SCHEMES (INACTIVE)'];
  clientNames: string[] = [];
  serviceTypes: string[] = [
    'AVS-Legal Assist',
    'Service Type B',
    'Service Type C',
  ];
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
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
    private caseDataService: CaseDataService,
    private breadcrumbService: BreadcrumbService 
    
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.caseRef = params.get('callRef') ?? '';
      this.callerName = params.get('callerName') ?? '';
      this.client = params.get('client') ?? '';

       this.breadcrumbService.setCaseRef(this.caseRef);
    });

    // Initialize the form with a client control
    this.callerForm = this.fb.group({
      client: [this.client || '1Life-Agency1'], // Default to '1Life-Agency1'
      serviceType: ['AVS-Legal Assist'],
      firstName: [''],
      secondName: [''],
      callbackNumber: [''],
      consent: [''],
      isPolicyHolder: [''],
      language: [''],
      refGiven: [''],
      callOpenDate: [''],
    });

    // Optional: use shared data from service
    this.caseData = this.caseDataService.getSelectedCase();
  }


  // completeStep(stepper: MatStepper): void {
  //   this.completedSteps[this.activeIndex] = true;
  //   stepper.next();
  //   // Remove manual update of activeIndex here
  // }

  // resetStepper(stepper: MatStepper): void {
  //   this.completedSteps = [false, false, false, false, false]; // ✅ proper reset
  //   this.activeIndex = 0;
  //   stepper.reset(); // optional: resets Angular Material stepper
  // }

  getYearRange() {
    throw new Error('Method not implemented.');
  }
}

