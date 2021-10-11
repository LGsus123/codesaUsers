import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private evtSubject = new Subject<any>();

  constructor() { }

  publish(data: any) {
    this.evtSubject.next(data);
  }

  getObservable(): Subject<any> {
    return this.evtSubject;
  }



}

