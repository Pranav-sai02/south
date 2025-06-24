import { Component } from '@angular/core';
import { CallerComponent } from '../tab-components/caller/caller.component';
import { ValidationComponent } from '../tab-components/validation/validation.component';
import { ComplaintsComponent } from '../tab-components/complaints/complaints.component';
import { DocumentsComponent } from '../tab-components/documents/documents.component';
import { VoucherSmsComponent } from '../tab-components/voucher-sms/voucher-sms.component';
import { AddPhase1Component } from '../tab-components/add-phase1/add-phase1.component';
import { AddPhase2Component } from '../tab-components/add-phase2/add-phase2.component';
import { AddPhase3Component } from '../tab-components/add-phase3/add-phase3.component';

@Component({
  selector: 'app-call-tabs',
  standalone: false,
  templateUrl: './call-tabs.component.html',
  styleUrl: './call-tabs.component.css'
})
export class CallTabsComponent {

  tabs = [
    { label: 'Caller', component: CallerComponent },
    { label: 'Validation', component: ValidationComponent },
    { label: 'Voucher/SMS', component: VoucherSmsComponent },
    { label: 'Complaints', component: ComplaintsComponent },
    { label: 'Documents', component: DocumentsComponent },
  ];

  selectedTab = 0;

  selectTab(index: number) {
    this.selectedTab = index;
  }

  onSelect() {
    console.log('Select from tab menu clicked');
    // Future logic can go here
  }

  addPhaseTab(phaseNumber: number) {
    const label = `Add Phase ${phaseNumber}`;
    const exists = this.tabs.some(tab => tab.label === label);
    if (!exists) {
      const componentMap: { [key: number]: any } = {
        1: AddPhase1Component,
        2: AddPhase2Component,
        3: AddPhase3Component
      };
      this.tabs.push({ label, component: componentMap[phaseNumber] });
      this.selectedTab = this.tabs.length - 1;
    }
  }
  closeTab(index: number): void {
    this.tabs.splice(index, 1);

    // Adjust selectedTab if it was the closed one or after it
    if (this.selectedTab === index) {
      this.selectedTab = Math.max(0, index - 1);
    } else if (this.selectedTab > index) {
      this.selectedTab--;
    }
  }
  isPhaseAdded(phaseNumber: number): boolean {
    return this.tabs.some(tab => tab.label === `Add Phase ${phaseNumber}`);
  }


}


