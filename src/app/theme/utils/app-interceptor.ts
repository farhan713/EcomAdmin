import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { CacheResolverService } from 'src/app/shared/services/cache-resolver.service';
const TIME_TO_LIVE = 1000;
@Injectable()
export class AppInterceptor implements HttpInterceptor {
    constructor( private spinner: NgxSpinnerService, private cacheResolver: CacheResolverService) {}
  
    intercept(req: HttpRequest<any>,
      next: HttpHandler): Observable<HttpEvent<any>> {

        // this.spinner.show();
        const token = localStorage.getItem("token");
        if(token) {
          req = req.clone({
            setHeaders: {
              Authorization: "Bearer " + token,
            },
          });
        }
      
        if (req.method !== 'GET') {

         let splitURL = req.url.split("/");
        //  console.log(splitURL[5]);
        //  if(splitURL[5] == "site_search_bm25") {
        //   const cachedResponse = this.cacheResolver.get(req.url + req.body.query);

        //   return cachedResponse ?  of(cachedResponse) : this.sendRequest(req, next)
        //  } else {
          return next.handle(req);
        //  }
         
      }

      const cachedResponse = this.cacheResolver.get(req.url);

      return cachedResponse ?  of(cachedResponse) : this.sendRequest(req, next)

        // return next.handle(req).pipe(map((event: HttpEvent<any>) => {
        //     if (event instanceof HttpResponse) {
        //       this.spinner.hide();
        //     }
        //     return event;
        //   }),
        //   catchError((error: HttpErrorResponse) => {
        //     const started = Date.now();            
        //     const elapsed = Date.now() - started;
        //     console.log(`Request for ${req.urlWithParams} failed after ${elapsed} ms.`);
        //    // debugger;
        //     return throwError(error);
        //   })
        // );

    }  

    sendRequest(req: HttpRequest<any>,
      next: HttpHandler) : Observable<HttpEvent<any>> {
          return next.handle(req).pipe(
              tap((event) =>{
                  if(event instanceof HttpResponse) {
                    // this.spinner.hide();
                      this.cacheResolver.set(req.url, event, TIME_TO_LIVE)
                  }
              })
          )
  }
}