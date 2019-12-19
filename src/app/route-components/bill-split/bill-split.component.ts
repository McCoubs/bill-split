import { Component, OnInit } from '@angular/core';
import { Friend } from '../../models/friend';
import { Bill, BillObject } from '../../models/bill';

@Component({
  selector: 'app-bill-split',
  templateUrl: './bill-split.component.html',
  styleUrls: ['./bill-split.component.scss']
})
export class BillSplitComponent implements OnInit {
  step: number = -1;
  friends: Friend[] = [];
  bills: Bill[] = [];

  constructor() {}

  ngOnInit() {}

  setStep(index: number) { this.step = index; }

  nextStep() { this.step++; }

  prevStep() { this.step--; }

  onFriendsChange(friends: Friend[]) { this.friends = friends; }

  onBillsChange(bills: BillObject[]) {
    this.bills = bills.map((bill) => new Bill(bill));
  }
}
