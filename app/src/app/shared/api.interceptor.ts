import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let newRequest:any
    if (request.headers.keys().find(item => item == 'Authorization')) {
      newRequest = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
        }
      })
    } else {
      newRequest = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('loggedInAs')}`
        }
      })
    }
    return next.handle(newRequest);
  }
}