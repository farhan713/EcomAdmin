import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { CacheResolverService } from "./cache-resolver.service";

 const TIME_TO_LIVE = 1000;
@Injectable()

export class CacheInterceptor implements HttpInterceptor {

    constructor(private cacheResolver: CacheResolverService) { }
    intercept(req: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.method !== 'GET') {
            return next.handle(req);
        }

        const cachedResponse = this.cacheResolver.get(req.url);

        return cachedResponse ?  of(cachedResponse) : this.sendRequest(req, next)
    }

    sendRequest(req: HttpRequest<any>,
        next: HttpHandler) : Observable<HttpEvent<any>> {
            return next.handle(req).pipe(
                tap((event) =>{
                    if(event instanceof HttpResponse) {
                        this.cacheResolver.set(req.url, event, TIME_TO_LIVE)
                    }
                })
            )
    }
}

function tap(arg0: (event: any) => void): import("rxjs").OperatorFunction<HttpEvent<any>, HttpEvent<any>> {
    throw new Error("Function not implemented.");
}
