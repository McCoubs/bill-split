import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Friend } from '../../models/friend';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-add-friends',
  templateUrl: './add-friends.component.html',
  styleUrls: ['./add-friends.component.scss']
})
export class AddFriendsComponent implements OnInit {
  friendsForm: FormGroup;
  @Output() onFriendsChange = new EventEmitter<Friend[]>();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // init new form and listen to its changes
    this.friendsForm = this.fb.group({ friends: this.fb.array([this.newFriend()]) });
    this.friendsForm.valueChanges.pipe(debounceTime(1000), distinctUntilChanged()).subscribe((values: { friends: Friend[] }) => {
      if (this.friendsForm.dirty && this.friendsForm.valid) {
        this.onFriendsChange.emit(values.friends);
      }
    });
  }

  addFriend(): void {
    (this.friendsForm.get('friends') as FormArray).push(this.newFriend());
  }

  newFriend(): AbstractControl {
    // create new form group for a friend
    return this.fb.group({
      name: ['', Validators.required],
      email: '',
      phone_number: '',
      uuid: uuid()
    });
  }

  deleteFriend(index: number) {
    (this.friendsForm.get('friends') as FormArray).removeAt(index);
  }
}
