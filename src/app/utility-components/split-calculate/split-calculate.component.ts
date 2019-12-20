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
  @Input() friends: Friend[];
  @Input() bills: Bill[];
  @Input() splits: { [billId: string]: { [friendId: string]: boolean } }[];
  needRecalculate: boolean = true;
  network: BillNetwork;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.needRecalculate = true;
  }

  calculate(): void {
    this.network = new BillNetwork(this.friends, this.bills);
    console.log(this.network);
  }
}
