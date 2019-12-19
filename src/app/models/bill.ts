import * as currency from 'currency.js';

export interface BillObject {
  owner: string;
  total: currency;
  name: string;
}

export class Bill {
  owner: string;
  total: any;
  name: string;

  constructor(bill: BillObject) {
    this.owner = bill.owner;
    this.name = bill.name;
    this.total = currency(bill.total);
  }

  distribute(count: number) {
    return this.total.distribute(count);
  }
}
