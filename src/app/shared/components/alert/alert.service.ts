import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Alert } from './alert.model';

@Injectable({ providedIn: 'root' })
export class AlertService {

  private alertSubject = new BehaviorSubject<Alert | null>(null);
  alert$ = this.alertSubject.asObservable();

  success(message: string) {
    this.show({ type: 'success', message });
  }

  error(message: string) {
    this.show({ type: 'error', message });
  }

  warning(message: string) {
    this.show({ type: 'warning', message });
  }

  info(message: string) {
    this.show({ type: 'info', message });
  }

  clear() {
    this.alertSubject.next(null);
  }

  private show(alert: Alert) {
    this.alertSubject.next(alert);
    setTimeout(() => this.clear(), 3000);
  }
}
