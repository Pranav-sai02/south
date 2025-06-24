import { Component } from '@angular/core';

@Component({
  selector: 'app-call-tabs',
  standalone: false,
  templateUrl: './call-tabs.component.html',
  styleUrl: './call-tabs.component.css'
})
export class CallTabsComponent {

  tabs = [
    { label: 'Caller' },
    { label: 'Validation' },
    { label: 'Voucher/SMS' },
    { label: 'Complaints' },
    { label: 'Documents' },
  ];

  selectedTab = 0;

  selectTab(index: number) {
    this.selectedTab = index;
  }

  onSelect() {
    console.log('Select from tab menu clicked');
    // Future logic can go here
  }

  addPhaseTab(phaseNumber: number): void {
  const label = `Add Phase ${phaseNumber}`;

  // Avoid duplicate phase tabs
  const exists = this.tabs.some(tab => tab.label === label);
  if (!exists) {
    this.tabs.push({ label });
    this.selectedTab = this.tabs.length - 1; // auto-switch to new tab
  }
}

}
