import { Injectable } from '@angular/core';
import { Client } from '../../models/Client';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../../../../constants/api-endpoints';
import { LoggerService } from '../../../../core/services/logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
 private apiUrl = API_ENDPOINTS.CLIENT;

  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) {}

  /** GET all clients */
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl).pipe(
      catchError(error => this.handleError(error, 'getAllClients'))
    );
  }

  /** GET client by ID */
  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => this.handleError(error, 'getClientById'))
    );
  }

  /** POST create a new client */
  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client).pipe(
      catchError(error => this.handleError(error, 'createClient'))
    );
  }

  /** PUT update an existing client */
  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client).pipe(
      catchError(error => this.handleError(error, 'updateClient'))
    );
  }

  /** DELETE client */
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => this.handleError(error, 'deleteClient'))
    );
  }

  /** PATCH soft delete client */
  softDeleteClient(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, { IsDeleted: true }).pipe(
      catchError(error => this.handleError(error, 'softDeleteClient'))
    );
  }

  /** Centralized error handler */
  private handleError(error: any, methodName: string): Observable<never> {
    this.logger.logError(error, `ClientService.${methodName}`);
    return throwError(() => error); // Allows global handler or interceptor to process
  }
}
