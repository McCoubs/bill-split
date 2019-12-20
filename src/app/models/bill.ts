import * as currency from 'currency.js';

export interface BillObject {
  owner: string;
  total: currency;
  name: string;
  uuid: string;
}

export class Bill {
  owner: string;
  total: any;
  name: string;
  uuid: string;

  constructor(bill: BillObject) {
    this.owner = bill.owner;
    this.name = bill.name;
    this.total = currency(bill.total);
    this.uuid = bill.uuid;
  }

  prettyPrint(): string {
    return this.name + ' ($' + this.total.toString() + ')';
  }

  distribute(count: number) {
    return this.total.distribute(count);
  }
}
