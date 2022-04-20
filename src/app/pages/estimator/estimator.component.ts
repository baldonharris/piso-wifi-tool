import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-estimator',
  templateUrl: './estimator.component.html',
  styleUrls: ['./estimator.component.css']
})
export class EstimatorComponent implements OnInit {
  components: any = environment.components;
  componentNames: string[] = Object.keys(environment.components);

  constructor() {}

  ngOnInit(): void {
    const test = Object.keys(this.components);
  }
}
