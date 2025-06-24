import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallTabsComponent } from './call-tabs.component';

describe('CallTabsComponent', () => {
  let component: CallTabsComponent;
  let fixture: ComponentFixture<CallTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CallTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
