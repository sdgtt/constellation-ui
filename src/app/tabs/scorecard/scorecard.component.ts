import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-scorecard',
  imports: [CommonModule],
  templateUrl: './scorecard.component.html',
  styleUrl: './scorecard.component.scss'
})
export class ScorecardComponent {

  scorecard ="The Scorecard generates the test results summary for the last 7 days, by default, to show trends of issues and failures of the test stages.";

  loadingMain: boolean = false;
  loadingMainText: string = "Loading...";
}
