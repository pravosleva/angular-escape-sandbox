import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Day1Step2 } from './components/day-1/step-2/step-2';
import { Day1Step3 } from './components/day-1/step-3/step-3';
import { Day1Step4 } from './components/day-1/step-4/step-4';
import { Day2Step1 } from './components/day-2/step-1/step-1';
import { Day2Step2 } from './components/day-2/step-2/step-2';
import { Day2Step3 } from './components/day-2/step-3/step-3';
import { Day3Step1 } from './components/day-3/step-1/step-1';
import { Day3Step2 } from './components/day-3/step-2/step-2';

@Component({
  imports: [
    RouterOutlet,
    Day1Step2,
    Day1Step3,
    Day1Step4,
    Day2Step1,
    Day2Step2,
    Day2Step3,
    Day3Step1,
    Day3Step2,
  ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('angular-escape-sandbox');
}
