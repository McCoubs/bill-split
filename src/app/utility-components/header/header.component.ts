import { Component, OnInit } from '@angular/core';
import { AuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private user: SocialUser;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.authState.subscribe((user: SocialUser) => {
      this.user = user;
      console.log(user);
    });
  }

  toggleAccountState(event: Event) {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .catch(console.error);
  }
}
