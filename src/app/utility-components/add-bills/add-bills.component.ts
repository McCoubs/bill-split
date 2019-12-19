import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BillObject } from '../../models/bill';
import { CurrencyPipe } from '@angular/common';
import { Friend } from '../../models/friend';

@Component({
  selector: 'app-add-bills',
  templateUrl: './add-bills.component.html',
  styleUrls: ['./add-bills.component.scss']
})
export class AddBillsComponent implements OnInit {
  billsForm: FormGroup;
  @Input() friends: Friend[];

  @Output() onBillsChange = new EventEmitter<BillObject[]>();

  constructor(private fb: FormBuilder, private currencyPipe: CurrencyPipe) {}

  ngOnInit() {
    // init new form and listen to its changes
    this.billsForm = this.fb.group({ bills: this.fb.array([this.newBill()]) });
    this.billsForm.valueChanges.pipe(debounceTime(1000), distinctUntilChanged()).subscribe((values: { bills: BillObject[] }) => {
      if (this.billsForm.dirty && this.billsForm.valid) {
        this.onBillsChange.emit(values.bills);
      }
    });
  }

  addBill(): void {
    (this.billsForm.get('bills') as FormArray).push(this.newBill());
  }

  newBill(): AbstractControl {
    // create new form group for a friend
    return this.fb.group({
      owner: ['', Validators.required],
      total: ['0.00', Validators.required],
      name: ''
    });
  }

  deleteBill(index: number) {
    (this.billsForm.get('bills') as FormArray).removeAt(index);
  }

  transform(event, index) {
    let value = event.target.value;
    value = value != null ? value : 0;
    const control: AbstractControl = (this.billsForm.get('bills') as FormArray).at(index);
    try {
      control.patchValue({ total: this.currencyPipe.transform(value, 'CAD', '') });
    } catch (e) {
      control.patchValue({ total: this.currencyPipe.transform(0, 'CAD', '') });
    }
  }
}
