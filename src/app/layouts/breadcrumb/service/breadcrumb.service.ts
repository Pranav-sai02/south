import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private caseRefSubject = new BehaviorSubject<string | null>(null);
  caseRef$ = this.caseRefSubject.asObservable();

  setCaseRef(ref: string | null) {
    console.log('[BreadcrumbService] Setting caseRef:', ref);
    this.caseRefSubject.next(ref);
  }

  clearCaseRef() {
    this.caseRefSubject.next(null);
  }
}
