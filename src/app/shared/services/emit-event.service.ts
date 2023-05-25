import { Injectable } from '@angular/core';
import { io } from "socket.io-client";
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EmitEventService {

  constructor() { }
  public latestData$: BehaviorSubject<string> = new BehaviorSubject('');
  socket = io('http://localhost:8080');

  public emitData(data: any) {
    // console.log('sendMessage: ', data)
    this.socket.emit('message', data);
  }
  public getLatestData = () => {
    this.socket.on('message', (latestData) =>{
      this.latestData$.next(latestData);
    });
    return this.latestData$.asObservable();
  }
  
}
