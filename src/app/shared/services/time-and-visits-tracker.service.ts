import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { timer, Subscription, BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimeAndVisitsTrackerService {
  private startTime: number;
  private timerSubscription: Subscription;
  private pageVisits: Map<string, number> = new Map<string, number>();
  // private pageVisits: Map<string, number> = new Map<string, number>();
  private dataSubject: BehaviorSubject<{ elapsedTime: number, pageVisits: Map<string, number> }> = new BehaviorSubject<{ elapsedTime: number, pageVisits: Map<string, number> }>({ elapsedTime: 0, pageVisits: new Map<string, number>() });
  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        const visitCount = this.pageVisits.get(url) || 0;
        this.pageVisits.set(url, visitCount + 1);
        this.emitData();
      });
  }

  startTracking() {
    this.startTime = Date.now();
    this.timerSubscription = timer(1000, 1000).subscribe(() => {
      const elapsedTime = Date.now() - this.startTime;
      const url = this.router.url;
      // console.log(`Time spent on page ${url}: ${elapsedTime}ms`);
      // console.log(`Number of visits to ${url}: ${this.pageVisits.get(url)}`);
      this.emitData();
    });
  }
  getData(): Observable<{ elapsedTime: number, pageVisits: Map<string, number> }> {
    return this.dataSubject.asObservable();
  }
  private emitData() {
    const elapsedTime = Date.now() - this.startTime;
    const pageVisits = new Map(this.pageVisits.entries());
    this.dataSubject.next({ elapsedTime, pageVisits });
  }
  stopTracking() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
      const elapsedTime = Date.now() - this.startTime;
      const url = this.router.url;
      // console.log(`Total time spent on page ${url}: ${elapsedTime}ms`);
      // console.log(`Total number of visits to ${url}: ${this.pageVisits.get(url)}`);
      this.emitData();
    }
  }

}
