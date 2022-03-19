import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FormControl, FormGroup } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';

export interface Earning {
  id: string;
  date: string;
  type: string;
  name: string;
  amount: number;
  location: string;
}

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.css']
})
export class EarningsComponent implements OnInit {
  earningForm = new FormGroup({
    date: new FormControl(''),
    name: new FormControl(''),
    type: new FormControl(''),
    amount: new FormControl(''),
    location: new FormControl('')
  });

  names: string[] = [];

  currentPage: number = 1;
  isFetchingEarnings: boolean = true;
  isSubmitting: boolean = false;
  earnings: Earning[] = [];

  constructor(private firebase: FirebaseService) {}

  ngOnInit(): void {
    this.fetchEarnings();
  }

  private fetchEarnings() {
    this.isFetchingEarnings = true;
    this.firebase.getEarnings().subscribe((earnings: Earning[]) => {
      this.earnings = earnings;
      this.isFetchingEarnings = false;
    });
  }

  onChangeType(type: string) {
    if (type === 'out') {
      this.names = [...environment.investors];
    } else {
      this.names = [...environment.earnings, ...Object.keys(environment.components)];
    }
  }

  onPaginate(page: number) {
    this.currentPage = page;
  }

  onSubmit() {
    this.isSubmitting = true;
    this.isFetchingEarnings = true;
    this.firebase.insert('earnings', this.earningForm.value).subscribe((r) => {
      this.fetchEarnings();
      this.earningForm.reset();
      this.isSubmitting = false;
      this.isFetchingEarnings = false;
    });
  }

  getCurrentOrder(index: number) {
    return index + (this.currentPage - 1) * 10;
  }
}
