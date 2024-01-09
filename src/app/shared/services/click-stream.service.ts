import { Injectable, EventEmitter, Output } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import * as SockJS from 'sockjs-client';
import * as stomp from 'stompjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {filter} from 'rxjs/operators';
import { Router,NavigationEnd  } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ClickStreamService {
  private socket$!: WebSocketSubject<any>;
  public receivedData: [] = [];
  @Output() aClickedEvent = new EventEmitter<string>();
  @Output() catClickedEvent = new EventEmitter<string>();
  @Output() loginEvent = new EventEmitter<string>();

  public latestData$: BehaviorSubject<string> = new BehaviorSubject('');
  productTrack: any = {
    product: '',
    from: '',
    lastscreen: '',
    currentScreen: '',
    lastStatus: '',
    query: '',
    sku_ids: []
  }
  currentTime = new Date();
  constructor(public http: HttpClient,
    public route: ActivatedRoute,
    public router: Router,) {
    // this.initializeWebSocketConnection();
    this.connect();
  }
  // socket = io('http://localhost:8080');
  public stompClient;
  setUser(userId) {
    localStorage.setItem("userid", userId)
  }

  AClicked(msg: string) {
    this.aClickedEvent.emit(msg);
  }

  catClick(cat: string) {
    this.catClickedEvent.emit(cat);
  }

  updateProductTrack(key, value) {
    this.productTrack[key] = value;
    if (this.productTrack.id != '') {
      localStorage.setItem(this.productTrack.product, JSON.stringify(this.productTrack));
    }

  }

  userLogin(msg: string) {
    this.getUser();
    location.reload();
    this.loginEvent.emit(msg);
  }
  randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  }

  getUser() {
    let userLocal = localStorage.getItem("userid");

    if (userLocal === null) {

      userLocal = '-1'
      this.setUser(userLocal)
    }
    return userLocal;
  }

  senEventToServer(brand, contentId, dept, event, eventType, genderType, location, productName, sessionId, styleId, subType, type, userAgeStage, userId) {

  }

  setSessionId() {
    let sessionId = this.randomString(12, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    localStorage.setItem("sessionId", sessionId);
    this.userVisit(sessionId,0,"false","false")
  }


  userVisit(sessionId,revenue,isSearched,isRecommended) {

    let data = {
      data_tables: [
        {
          table_name: "tb_user_visit_table",
          data: {
            session_id: sessionId,
            revenue: revenue,
            is_searched: isSearched,
            is_recommended: isRecommended,
            org_id : this.getOrgId(),
          }
        }
      ]

    }
   let myUrl = window.location.href.split('/')

if(!myUrl.includes('admin')) {
  this.http.post<any>('http://127.0.0.1:8000/console/user_visits', { response: data }).subscribe({
    next: data => {
    },
    error: error => {
    }
  })
}
  
  }
  getSessionId() {
    let sessionId = localStorage.getItem("sessionId");


    return sessionId;
  }

  sendMessage(eventData) {
    let lat;
    let long;
    navigator.geolocation.getCurrentPosition(resp => {
      lat = resp.coords.longitude;
      long = resp.coords.latitude;
      let data = {
        brand: "string",
        contentId: "string",
        dept: "string",
        event: "string",
        eventTime: this.currentTime,
        eventType: "string",
        genderType: "MALE",
        location: lat + ',' + long,
        productName: "string",
        sessionId: "string",
        styleId: "string",
        subType: "string",
        type: "string",
        userAgeStage: "ADULT",
        userId: this.getUser(),
        query: 'string',
        productId : ''
      }
      for (const [key, value] of Object.entries(eventData)) {
        data[key] = value;
      }
      setTimeout(() => {
        this.socket$.next(JSON.stringify(data));
      }, 500);

    },
      err => {
      });

  }



  public connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket("ws://localhost:8000/app/message");
      this.socket$.subscribe((data: any) => {
      }, err => {
      });
    }
  }
  setOrganizationData(data) {
    localStorage.setItem("org_id", data.org_id);
    localStorage.setItem("store_id", data.store_id);
  }

  getOrgId() {
    let orgId = localStorage.getItem("org_id");
    if(orgId) {
      return orgId
    } else {
      return -1
    }
  }
  getAdminOrgId() {
    let orgId = localStorage.getItem("adminOrg");
    if(orgId) {
      return orgId
    } else {
      return -1
    }
  }

  getStoreId() {
    let storeId = localStorage.getItem("store_id");
    if(storeId) {
      return storeId
    } else {
      return -1
    }
  }
}
