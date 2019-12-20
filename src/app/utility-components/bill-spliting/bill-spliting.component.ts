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
    this.splitForm = this.fb.group({ bills: this.fb.group({}) });
  }

  ngOnInit() {
    this.splitForm.valueChanges.pipe(debounceTime(1000), distinctUntilChanged()).subscribe((values: { bills: {}[] }) => {
      if (this.splitForm.dirty && this.splitForm.valid) {
        this.onBillsSplit.emit(values.bills);
      }
    });
  }

  buildForm(bills: Bill[], friends: Friend[]) {
    const controls = bills.reduce((control: {}, bill: Bill) => {
      // for every bill, create a list of friends as options
      const friendControl = this.fb.group(friends.reduce((obj: {}, friend: Friend) => {
        if (bill.owner !== friend.uuid) {
          return Object.assign(obj, { [friend.uuid]: false });
        } else {
          return obj;
        }
      }, {}));
      return Object.assign(control, { [bill.uuid]: friendControl });
    }, {});

    this.splitForm.setControl('bills', this.fb.group(controls));
  }
}
