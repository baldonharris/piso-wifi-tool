import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FirebaseService, Item } from '../../services/firebase.service';
import { environment } from '../../../environments/environment';
import { UtilsService } from '../../services/utils.service';
import { Earning } from '../earnings/earnings.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  investors: string[] = environment.investors;
  investments: any = {};
  cashflow: any = { in: 0, out: 0 };
  buckets: any = { Bank: 0, Onhand: 0 };
  profit: number = 0;
  totalUnpaid: number = 0;
  withdrawn: any = {};
  withdrawnTotal: number = 0;
  potentialCut: any = {};

  totalInvestments: number = 0;

  constructor(private firebase: FirebaseService, private utils: UtilsService) {
    this.investors = this.utils.getInvestors('Earnings');
  }

  ngOnInit(): void {
    this.firebase.getOrders().subscribe((items: Item[]) => {
      for (let item of items) {
        this.createInvestor(item.paid_by);
        this.createInvestor(item.paid_in_behalf_by);

        // @ts-ignore
        if (this.investors.indexOf(item.paid_by) > -1) {
          this.investments[item.paid_by] += Number(item.total);
        }

        if (this.investors.indexOf(item.paid_in_behalf_by) > -1) {
          // @ts-ignore
          this.investments[item.paid_in_behalf_by] += Number(item.paid_in_behalf_amount);
        }

        if (item.status === 'unpaid') {
          this.totalUnpaid += item.total;
        }
      }

      for (let [investor, investment] of Object.entries(this.investments)) {
        this.investments[investor] = this.utils.roundUp(Number(investment));

        if (investor !== 'Earnings') {
          this.totalInvestments += this.investments[investor];
        }
      }

      this.investors[this.investors.indexOf('Earnings')] = 'Rerolled';
      this.investors.sort();

      this.buckets['Bank'] = -this.investments['Earnings'];
      this.firebase.getEarnings().subscribe((earnings: Earning[]) => {
        earnings.forEach((earning: Earning) => {
          // @ts-ignore
          this.cashflow[earning.type] += earning.amount;

          // @ts-ignore
          this.buckets[earning.location] += earning.type === 'in' ? earning.amount : -earning.amount;

          if (earning.type === 'out') {
            if (this.withdrawn[earning.name] === undefined) {
              this.withdrawn[earning.name] = 0;
            }
            this.withdrawn[earning.name] += earning.amount;
            this.withdrawnTotal += earning.amount;
          }
        });

        this.profit = this.cashflow['in'] - this.investments['Earnings'] - this.totalInvestments;

        for (let investor of this.investors) {
          if (investor !== 'Rerolled') {
            if (this.potentialCut[investor] === undefined) {
              this.potentialCut[investor] = 0;
            }

            this.potentialCut[investor] =
              this.profit / (this.investors.length - 1) - (this.withdrawn[investor] - this.investments[investor]);
          }
        }
      });
    });
  }

  get currentMoney() {
    return this.buckets['Bank'] + this.buckets['Onhand'];
  }

  private createInvestor(name: string) {
    if (this.investments[name] === undefined && name !== '-') {
      this.investments[name] = 0;
    }
  }
}
