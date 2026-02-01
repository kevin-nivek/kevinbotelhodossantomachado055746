import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HealthService } from "./heallth.service";

@Injectable({providedIn: 'root'})
export class HealthFacade{
  private statusSubject = new BehaviorSubject<'UP' | 'DOWN'>('UP')
  status$ = this.statusSubject.asObservable();

  constructor(
    private service: HealthService
  ){}

  checkHealth(){
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
}
