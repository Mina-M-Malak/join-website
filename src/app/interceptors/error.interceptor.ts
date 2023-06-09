import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private toastr:ToastrService,
    private router :Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      map((event: any) => {
        let body =  event?.body
        if(body?.code==0 
          && body?.message 
          && body?.message!='Please 1st add child your child details'  
          && !event.url.includes('logIn') ) {
          this.toastr.error(body?.message,'', {
            timeOut: 7000,
          })
        } else if (body?.code==3) {
          if(localStorage.getItem('lang')=='ar') {
            this.toastr.error('يجب عليك  تسجيل الدخول مؤة اخري','', {
              timeOut: 7000,
            })
          } else  {
            this.toastr.error('You Have To Login Again','', {
              timeOut: 7000,
            })
          }
          localStorage.removeItem('joincart')
          localStorage.removeItem('guestHistory')
          localStorage.removeItem('not_user_data')
          localStorage.removeItem('joinToken')
          localStorage.removeItem('notUserAddress')
          this.router.navigate(['/auth/login'])
          location.reload()
        }
      return event
  }),
  
  );
  }
}
