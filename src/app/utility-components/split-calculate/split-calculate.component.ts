import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Friend } from '../../models/friend';
import { Bill } from '../../models/bill';
import { BillNetwork } from '../../models/bill-network';

@Component({
  selector: 'app-split-calculate',
  templateUrl: './split-calculate.component.html',
  styleUrls: ['./split-calculate.component.scss']
})
export class SplitCalculateComponent implements OnInit, OnChanges {
  @Input() friends: Friend[] = [];
  @Input() bills: Bill[] = [];
  @Input() splits: { [billId: string]: { [friendId: string]: boolean } }[] = [];

  needRecalculate: boolean = true;
  network: BillNetwork;
  displayedColumns: string[] = [];
  dataSource: {}[] = [];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.needRecalculate = true;
  }

  calculate(): void {
    // create and calculate a network
    this.network = new BillNetwork(this.friends, this.bills);
    const splitMap = this.network.calculateNetwork(this.splits);
    // sort friends in order
    this.friends = this.friends.sort((a, b) => a.uuid < b.uuid ? 0 : 1);
    // display columns in order
    this.displayedColumns = ['name'].concat(this.friends.map((friend) => friend.uuid));
    // insert data in order
    this.dataSource = this.friends.map((friend: Friend) => Object.assign(splitMap.get(friend.uuid), { uuid: friend.uuid, name: friend.name }));
    this.needRecalculate = false;
  }
}
