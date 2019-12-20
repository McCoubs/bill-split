import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Friend } from '../../models/friend';
import { Bill } from '../../models/bill';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-bill-spliting',
  templateUrl: './bill-spliting.component.html',
  styleUrls: ['./bill-spliting.component.scss']
})
export class BillSplitingComponent implements OnInit {
  @Output() onBillsSplit = new EventEmitter<{}[]>();
  splitForm: FormGroup;
  _friends: Friend[] = [];
  _bills: Bill[] = [];

  @Input() set friends(friends: Friend[]) {
    this.buildForm(this._bills, friends);
    this._friends = friends;
  }

  @Input() set bills(bills: Bill[]) {
    this.buildForm(bills, this._friends);
    this._bills = bills;
  }

  constructor(private fb: FormBuilder) {
    this.splitForm = this.fb.group({ bills: this.fb.array([]) });
  }

  ngOnInit() {
    this.splitForm.valueChanges.pipe(debounceTime(1000), distinctUntilChanged()).subscribe((values: { bills: {}[] }) => {
      if (this.splitForm.dirty && this.splitForm.valid) {
        console.log(values);
        this.onBillsSplit.emit(values.bills);
      }
    });
  }

  buildForm(bills: Bill[], friends: Friend[]) {
    // create a form array for every bill where every friend is an option
    const controls = bills.map((bill: Bill) =>  this.fb.group(friends.reduce((obj: {}, friend: Friend) => {
      if (bill.owner !== friend.uuid) {
        return Object.assign(obj, { [friend.uuid]: false });
      } else {
        return obj;
      }
    }, {})));

    this.splitForm.setControl('bills', this.fb.array(controls));
  }
}
