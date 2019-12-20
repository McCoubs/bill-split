import { Friend } from './friend';
import { Bill } from './bill';
import * as currency from 'currency.js';

export class BillNetwork {
  friends: { [uuid: string]: Friend };
  bills: { [uuid: string]: Bill };

  adjMap: Map<string, { [target: string]: any }> = new Map();

  constructor(friends: Friend[], bills: Bill[]) {
    this.friends = this.mapToObject(friends);
    this.bills = this.mapToObject(bills);

    friends.forEach((source: Friend) => {
      const map = friends.reduce((obj: {}, target: Friend) => {
        if (source.uuid !== target.uuid) {
          return Object.assign(obj, { [target.uuid]: currency(0) });
        } else {
          return obj;
        }
      }, {});
      this.adjMap.set(source.uuid, map);
    });
  }

  calculateNetwork(splits: { [billId: string]: { [friendId: string]: boolean } }[], optimize: boolean = true): Map<string, { [target: string]: any }> {
    Object.entries(splits).forEach(([billId, split]) => {
      const bill: Bill = this.bills[billId];
      // determine contributors for every bill
      const contributors = Object.entries(split).reduce((output, [friendId, isPart]) => isPart ? output.concat(friendId) : output, []);
      // calc amount each person owes (include owner in split)
      const amountOweing = bill.distribute(contributors.length + 1);
      // add amount owed to each persons link to owner
      contributors.forEach((friendId: string, index: number) => {
        const debt = this.adjMap.get(friendId);
        debt[bill.owner] = debt[bill.owner].add(currency(amountOweing[index]));
        this.adjMap.set(friendId, debt);
      });
    });
    return this.adjMap;
  }

  generatePrettyPrint(friendUuid: string): string {
    return '';
  }

  private mapToObject(list: { uuid: string }[]): { [uuid: string]: any } {
    return list.reduce((obj: {}, current: { uuid: string }) => {
      return Object.assign(obj, { [current.uuid]: current });
    }, {});
  }
}
