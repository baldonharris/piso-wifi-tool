import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Earning {
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

  investors: string[] = [
    ... environment.investors
  ];

  currentPage: number = 1;
  isFetchingEarnings: boolean = true;
  isSubmitting: boolean = false;
  earnings: Earning[] = [];

  constructor(
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {
    this.fetchEarnings();
  }

  private fetchEarnings() {
    this.isFetchingEarnings = true;
    this.httpClient.get(environment.firebase.earnings)
      .subscribe((earnings) => {
        this.earnings = [];
        if (earnings) {
          for (const [key, value] of Object.entries(earnings)) {
            value.amount = Number(value.amount);

            this.earnings.push({ ... {id: key}, ... value });
          }

          // @ts-ignore
          this.earnings.sort((a, b) => (new Date(b.date) - new Date(a.date)));
        }
        this.isFetchingEarnings = false;
      });
  }

  onChangeType(type: string) {
    if (type === 'out') {
      this.names = [
        ... environment.investors
      ];
    } else {
      this.names = [
        ... environment.earnings,
        ... Object.keys(environment.components)
      ];
    }
  }

  onPaginate(page: number) {
    this.currentPage = page;
  }

  onSubmit() {
    this.isSubmitting = true;
    this.httpClient.post(environment.firebase.earnings, this.earningForm.value)
      .subscribe((r) => {
        this.fetchEarnings();
        this.earningForm.reset();
        this.isSubmitting = false;
      });
  }

  getCurrentOrder(index: number) {
    return index + ((this.currentPage - 1) * 10);
  }

}
