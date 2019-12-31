import { Component, Input, OnInit } from '@angular/core';
import { Friend } from '../../models/friend';
import { Bill } from '../../models/bill';
import { BillNetwork } from '../../models/bill-network';
import { GoogleAuthService } from '../../services/google-auth.service';
import { SocialUser } from 'angularx-social-login';
import { ReminderService } from '../../services/reminder.service';
import { NotifierService } from 'angular-notifier';
import { HttpErrorResponse } from '@angular/common/http';

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

  constructor(private auth: GoogleAuthService, private reminder: ReminderService, private notifier: NotifierService) {}

  ngOnInit() {
    // if signed in, add email + text options to table
    this.auth.user.subscribe((user: SocialUser) => {
      this.displayedColumns = !!user ? ['name', 'copy', 'email', 'text'] : ['name', 'copy'];
    });
  }

  sendEmail(friend: Friend): void {
    this.reminder.sendEmail(friend.email, this.network.generateEmailBody(friend.uuid)).subscribe(
      (resp: {}) => this.notifier.notify('success', 'Successfully sent an email to ' + friend.email),
      (error: HttpErrorResponse) => this.notifier.notify('error', error.error)
    );
  }

  sendText(friend: Friend): void {

  }
}
