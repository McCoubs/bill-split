import { Component, Input, OnInit } from '@angular/core';
import { Friend } from '../../models/friend';
import { Bill } from '../../models/bill';
import { BillNetwork } from '../../models/bill-network';

@Component({
  selector: 'app-split-share',
  templateUrl: './split-share.component.html',
  styleUrls: ['./split-share.component.scss']
})
export class SplitShareComponent implements OnInit {
  @Input() friends: Friend[] = [];
  @Input() bills: Bill[] = [];
  @Input() network: BillNetwork;

  displayedColumns: string[] = ['name', 'copy'];

  constructor() {}

  ngOnInit() {}
}
