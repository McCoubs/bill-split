import { Friend } from './friend';
import { Bill } from './bill';
import * as currency from 'currency.js';

export class BillNetwork {
  friends: { [uuid: string]: Friend };
  bills: { [uuid: string]: Bill };

  adjMap: {[source: string]: { [target: string]: any } } = {};

  constructor(friends: Friend[], bills: Bill[]) {
    this.friends = this.mapToObject(friends);
    this.bills = this.mapToObject(bills);

    this.adjMap = friends.reduce((network: {}, source: Friend) => {
      const map = friends.reduce((obj: {}, target: Friend) => {
        if (source.uuid !== target.uuid) {
          return Object.assign(obj, { [target.uuid]: currency(0) });
        } else {
          return obj;
        }
      }, {});
      return Object.assign(network, { [source.uuid]: map });
    }, {});
  }

  calculateNetwork(splits: { [billId: string]: { [friendId: string]: boolean } }[], optimize: boolean = true): {[source: string]: { [target: string]: any } } {
    Object.entries(splits).forEach(([billId, split]) => {
      const bill: Bill = this.bills[billId];
      // determine contributors for every bill
      const contributors = Object.entries(split).reduce((output, [friendId, isPart]) => isPart ? output.concat(friendId) : output, []);
      // calc amount each person owes (include owner in split)
      const amountOweing = bill.distribute(contributors.length + 1);
      // add amount owed to each persons link to owner
      contributors.forEach((friendId: string, index: number) => {
        this.adjMap[friendId][bill.owner] = this.adjMap[friendId][bill.owner].add(currency(amountOweing[index]));
      });
    });

    if (optimize) {
      const friends: string[] = Object.keys(this.friends);
      // for every combo of friend (at most once)
      for (let i = 0; i < friends.length; i++) {
        for (let j = 0; j < i; j++) {
          // get oweing relations
          const source = friends[i];
          const target = friends[j];
          const forward = this.adjMap[source][target];
          const backward = this.adjMap[target][source];
          // if they owe one another, simplify the relationship to only 1 person oweing
          if (forward.intValue >= backward.intValue) {
            this.adjMap[source][target] = forward.subtract(backward);
            this.adjMap[target][source] = currency(0);
          } else {
            this.adjMap[target][source] = backward.subtract(forward);
            this.adjMap[source][target] = currency(0);
          }
        }
      }
    }
    return this.adjMap;
  }

  generateCopyText(friendId: string): string {
    return `${this.friends[friendId].name} owes:\r\n` + Object.entries(this.adjMap[friendId]).map(([target, amount]) => {
      return `\t${this.friends[target].name}: ${amount.format(true)}`;
    }).join('\r\n');
  }

  generateEmailBody(friendId: string): string {
    return `Hi ${this.friends[friendId].name},\r\n \r\nThis is an automatic email from bill-split.spencermccoubrey.com.\r\n` +
      `A friend has calculated your split of some bills, this is a reminder of how much you owe:\r\n` +
        Object.entries(this.adjMap[friendId]).map(([target, amount]) => {
          return `\tYou owe ${this.friends[target].name}: ${amount.format(true)}`;
        }).join('\r\n');
  }

  private mapToObject(list: { uuid: string }[]): { [uuid: string]: any } {
    return list.reduce((obj: {}, current: { uuid: string }) => {
      return Object.assign(obj, { [current.uuid]: current });
    }, {});
  }
}
