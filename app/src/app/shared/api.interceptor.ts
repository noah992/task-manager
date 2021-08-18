import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

// add token everytime http request sent

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const newRequest = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('BearerToken')}`
      }
    })
    return next.handle(newRequest);
  }
}
