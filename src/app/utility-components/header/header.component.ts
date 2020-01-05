import { Component } from '@angular/core';
import { GoogleAuthService } from '../../services/google-auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(public auth: GoogleAuthService) {}

  logIn() { this.auth.logIn(); }

  logOut() { this.auth.logOut(); }
}
