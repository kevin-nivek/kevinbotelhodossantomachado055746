import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './shared/components/menu/menu.component';
import { HealthService } from './core/health/heallth.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { HealthFacade } from './core/health/health.facade';
import { AlertComponent } from "./shared/components/alert/alert.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent, AsyncPipe, AlertComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App  implements OnInit{
  protected readonly title = signal('kevinbotelhodossantomachado055746');

  constructor(public health: HealthFacade){}

  ngOnInit(): void {
    this.health.checkHealth();
  }

}
