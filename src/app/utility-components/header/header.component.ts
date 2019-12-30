import { Component, OnInit } from '@angular/core';
import { SocialUser } from 'angularx-social-login';
import { GoogleAuthService } from '../../services/google-auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: SocialUser = null;

  constructor(private auth: GoogleAuthService) {}

  ngOnInit() {
    this.auth.user.subscribe((user: SocialUser) => this.user = user);
  }

  logIn() { this.auth.logIn(); }

  logOut() { this.auth.logOut(); }
}
