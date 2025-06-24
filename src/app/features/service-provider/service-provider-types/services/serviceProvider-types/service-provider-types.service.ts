import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ServiceProviderTypes } from '../../models/ServiceProviderTypes';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../../../../../constants/api-endpoints';
import { LoggerService } from '../../../../../core/services/logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class ServiceProviderTypesService {
  private readonly apiUrl = API_ENDPOINTS.SERVICE_PROVIDER_TYPES;

  constructor(private http: HttpClient, private logger: LoggerService) {}

  /** GET all */
  getAllServiceProviderTypes(): Observable<ServiceProviderTypes[]> {
    return this.http.get<ServiceProviderTypes[]>(this.apiUrl).pipe(
      catchError((error) => {
        this.logger.logError(error, 'Error in getAllServiceProviderTypes');
        return throwError(() => error);
      })
    );
  }

  /** GET single */
  getServiceProviderTypeById(id: number): Observable<ServiceProviderTypes> {
    return this.http.get<ServiceProviderTypes>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        this.logger.logError(error, 'Error in getServiceProviderTypeById');
        return throwError(() => error);
      })
    );
  }

  /** POST create */
  createServiceProviderType(
    payload: ServiceProviderTypes
  ): Observable<ServiceProviderTypes> {
    return this.http.post<ServiceProviderTypes>(this.apiUrl, payload).pipe(
      catchError((error) => {
        this.logger.logError(error, 'Error in createServiceProviderType');
        return throwError(() => error);
      })
    );
  }

  /** PUT update  */
  updateServiceProviderType(
    id: number,
    payload: ServiceProviderTypes
  ): Observable<ServiceProviderTypes> {
    return this.http
      .put<ServiceProviderTypes>(`${this.apiUrl}/${id}`, payload)
      .pipe(
        catchError((error) => {
          this.logger.logError(error, 'Error in updateServiceProviderType');
          return throwError(() => error);
        })
      );
  }

  /** DELETE */
  deleteServiceProviderType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        this.logger.logError(error, 'Error in deleteServiceProviderType');
        return throwError(() => error);
      })
    );
  }

  softDeleteServiceProviderType(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, { IsDeleted: true }).pipe(
      catchError((error) => {
        this.logger.logError(error, 'Error in softDeleteServiceProviderType');
        return throwError(() => error);
      })
    );
  }
}
