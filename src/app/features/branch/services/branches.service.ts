import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Branch } from '../model/branch';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoggerService } from '../../../core/services/logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class BranchesService {
  private apiUrl = 'http://localhost:3000/branches';

  constructor(private http: HttpClient, private logger: LoggerService) { }

  private handleError(error: any, method: string) {
    this.logger.logError(error, `BranchesService.${method}`);
    return throwError(() => error);
  }

  /** GET all branches */
  getBranches(): Observable<Branch[]> {
    console.log('[BranchesService] Calling API:', this.apiUrl); // ✅ Add this
    return this.http.get<Branch[]>(this.apiUrl).pipe(
      tap((res) => console.log('[BranchesService] Response:', res)), // ✅ Add this
      catchError((error) => this.handleError(error, 'getBranches'))
    );
  }


  /** PUT full update */
  updateBranch(branchId: number, payload: Partial<Branch>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${branchId}`, payload).pipe(
      catchError((error) => this.handleError(error, 'updateBranch'))
    );
  }

  /** PATCH soft delete */
  softDeleteBranch(branchId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${branchId}`, { IsDeleted: true }).pipe(
      catchError((error) => this.handleError(error, 'softDeleteBranch'))
    );
  }
}
