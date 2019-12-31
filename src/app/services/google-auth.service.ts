import { Injectable } from '@angular/core';
import { AuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private userSubject: BehaviorSubject<SocialUser> = new BehaviorSubject<SocialUser>(null);

  constructor(private auth: AuthService, private http: HttpClient) {
    // pipe output of auth-service into behaviour subject
    this.auth.authState.subscribe((user: SocialUser) => {
      if (!user) {
        this.userSubject.next(user);
      } else {
        this.http.post(environment.apiEndpoint + 'google-auth-login', { idToken: user.idToken }).subscribe(
          () => this.userSubject.next(user),
          () => this.userSubject.next(null)
        );
      }
    });
  }

  get user(): Observable<SocialUser> {
    return this.userSubject;
  }

  logIn() { this.auth.signIn(GoogleLoginProvider.PROVIDER_ID); }

  logOut() {
    this.http.post(environment.apiEndpoint + 'google-auth-logout', {}).subscribe(() => this.auth.signOut());
  }
}
