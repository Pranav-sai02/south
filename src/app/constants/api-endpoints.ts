import { environment } from '../../environments/environments';

export const API_ENDPOINTS = {
  SIDE_BAR_SERVICE: `${environment.apiBaseUrl}/Get/MenuConfigurations`,
  AREA_CODES: `${environment.apiBaseUrl}/Config/AreaCodes`,
  USERS: `${environment.apiBaseUrl}/Users`,
  SERVICE_PROVIDER_TYPES: `${environment.apiBaseUrl}/Config/ServiceProviderTypes`,
  SERVICES_PAGE: `${environment.apiBaseUrl}/Service`,
  SERVICE_PROVIDERS: `${environment.apiBaseUrl}/ServiceProvider`,
  CLIENT_GROUP: `${environment.apiBaseUrl}/ClientGroup`,
  CLIENT: `${environment.apiBaseUrl}/Client`,
  CASE_DEATILS: `${environment.apiBaseUrl}/CaseDetails`,
  CALLER_DETAILS: `${environment.apiBaseUrl}/CaseCaller`,
};
