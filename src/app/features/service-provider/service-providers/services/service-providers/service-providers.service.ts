import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceProviders } from '../../models/ServiceProviders';
import { catchError, Observable, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../../../../constants/api-endpoints';
import { LoggerService } from '../../../../../core/services/logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class ServiceProvidersService {
  private readonly baseUrl = API_ENDPOINTS.SERVICE_PROVIDERS; 
 
  constructor(private http: HttpClient, private logger: LoggerService) {}

   private handleError(error: any, methodName: string): Observable<never> {
    const context = `ServiceProvidersService.${methodName}`;
    this.logger.logError(error, context);
    return throwError(() => error);
  }

  getServiceProviders(): Observable<ServiceProviders[]> {
    return this.http.get<ServiceProviders[]>(this.baseUrl).pipe(
      catchError(error => this.handleError(error, 'getServiceProviders'))
    );
  }

  addServiceProvider(provider: ServiceProviders): Observable<ServiceProviders> {
    return this.http.post<ServiceProviders>(this.baseUrl, provider).pipe(
      catchError(error => this.handleError(error, 'addServiceProvider'))
    );
  }

   updateServiceProvider(provider: ServiceProviders): Observable<ServiceProviders> {
    const url = `${this.baseUrl}/${provider.ServiceProviderId}`;
    return this.http.put<ServiceProviders>(url, provider).pipe(
      catchError(error => this.handleError(error, 'updateServiceProvider'))
    );
  }

  deleteServiceProvider(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => this.handleError(error, 'deleteServiceProvider'))
    );
  }

 softDeleteServiceProvider(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, { IsDeleted: true }).pipe(
      catchError(error => this.handleError(error, 'softDeleteServiceProvider'))
    );
  }
}
