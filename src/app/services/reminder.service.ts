import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReminderService {

  constructor(private http: HttpClient) {}

  sendEmail(target: string, body: string): Observable<{}> {
    return this.sendReminder('email', target, body);
  }

  sendSms(target: string, body: string): Observable<{}> {
    return this.sendReminder('sms', target, body);
  }

  private sendReminder(type: string, target: string, body: string): Observable<{}> {
    return this.http.post(environment.apiEndpoint + 'send-reminder', { target, type, text: body });
  }
}
