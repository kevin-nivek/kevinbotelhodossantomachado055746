import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from './alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html'
})
export class AlertComponent {
  constructor(public alertService: AlertService) {}
}
