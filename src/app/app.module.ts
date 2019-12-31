import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// modules
import { AppRoutingModule } from './app-routing.module';
import { AuthServiceConfig, GoogleLoginProvider, SocialLoginModule } from 'angularx-social-login';
import { CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCheckboxModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule, MatTableModule,
  MatTabsModule
} from '@angular/material';
import { NotifierModule } from 'angular-notifier';

// components
import { AppComponent } from './bootstrap/app.component';
import { BillSplitComponent } from './route-components/bill-split/bill-split.component';
import { HeaderComponent } from './utility-components/header/header.component';
import { InstructionsComponent } from './utility-components/instructions/instructions.component';
import { AddFriendsComponent } from './utility-components/add-friends/add-friends.component';
import { AddBillsComponent } from './utility-components/add-bills/add-bills.component';
import { BillSplitingComponent } from './utility-components/bill-spliting/bill-spliting.component';
import { SplitCalculateComponent } from './utility-components/split-calculate/split-calculate.component';
import { SplitShareComponent } from './utility-components/split-share/split-share.component';

// directives
import { CopyClipboardDirective } from './copy-clipboard.directive';

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('1046114640434-1knpb5nv20gjpg0436i4crvkre9r15ca.apps.googleusercontent.com')
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    BillSplitComponent,
    HeaderComponent,
    InstructionsComponent,
    AddFriendsComponent,
    AddBillsComponent,
    BillSplitingComponent,
    SplitCalculateComponent,
    CopyClipboardDirective,
    SplitShareComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SocialLoginModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatTabsModule,
    MatCheckboxModule,
    MatTableModule,
    FormsModule,
    NotifierModule
  ],
  providers: [
    CurrencyPipe,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
