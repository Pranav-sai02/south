import { ErrorHandler, Injectable, Injector } from '@angular/core';

import { LoggerService } from '../services/logger/logger.service';
import { ToasterService } from '../services/toaster-service/toaster.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    const toasterService = this.injector.get(ToasterService);
    const logger = this.injector.get(LoggerService);

    logger.logError(error);
    toasterService.showError('An unexpected error occurred.');
    console.error('Global Error:', error);
  }
}
