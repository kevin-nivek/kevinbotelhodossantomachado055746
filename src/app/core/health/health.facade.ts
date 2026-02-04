import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { BehaviorSubject, fromEvent, map, merge, of } from "rxjs";
import { HealthService } from "./heallth.service";
import { isPlatformBrowser } from "@angular/common";

@Injectable({providedIn: 'root'})
export class HealthFacade{
  private statusSubject = new BehaviorSubject<'UP' | 'DOWN'>('UP')
  status$ = this.statusSubject.asObservable();

  constructor(
    private service: HealthService,
     @Inject(PLATFORM_ID) private platformId: object
  ){
  if (isPlatformBrowser(this.platformId)) {
      this.monitorConnection();
    }
  }

  private monitorConnection(){
    merge(
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false)),
      of(navigator.onLine)
    ).subscribe(isOnline => {
      if (isOnline) {
        this.checkHealth();
      } else {
        this.statusSubject.next('DOWN');
      }
    });
  }

  checkHealth(){
    if (!navigator.onLine) {
      this.statusSubject.next('DOWN');
      return;
    }
    this.service.checkHealth().subscribe({
      next: () => this.statusSubject.next('UP'),
      error: err => {
        if ([401, 403].includes(err.status)) {
          this.statusSubject.next('UP');
        } else {
          this.statusSubject.next('DOWN');
        }
      }
    })
  }

  changeStatus(stats: 'DOWN' | 'UP'){
    this.statusSubject.next(stats);
  }
}
