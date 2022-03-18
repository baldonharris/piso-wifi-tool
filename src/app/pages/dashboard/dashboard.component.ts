import { Component, OnInit } from '@angular/core';
import { FirebaseService, Item } from '../../services/firebase.service';
import { environment } from '../../../environments/environment';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  investors: string[] = environment.investors;
  investments: any = {};

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
      }

      for (let [investor, investment] of Object.entries(this.investments)) {
        this.investments[investor] = this.utils.roundUp(Number(investment));
      }
    });
  }

  private createInvestor(name: string) {
    if (this.investments[name] === undefined && name !== '-') {
      this.investments[name] = 0;
    }
  }
}
