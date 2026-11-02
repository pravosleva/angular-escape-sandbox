import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Step2 } from './components/day-1/step-2/step-2';
import { Step3 } from './components/day-1/step-3/step-3';
import { Step4 } from './components/day-1/step-4/step-4';

@Component({
  imports: [RouterOutlet, Step2, Step3, Step4],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('angular-escape-sandbox');
}
