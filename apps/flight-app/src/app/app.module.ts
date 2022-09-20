import { FlightCancellingModule } from './flight-booking/flight-cancelling/flight-cancelling.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FlightLibModule } from '@flight-workspace/flight-lib';

import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routes';
import { BasketComponent } from './basket/basket.component';
import { FlightBookingModule } from './flight-booking/flight-booking.module';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SharedModule } from './shared/shared.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FlightLookaheadComponent } from './flight-lookahead/flight-lookahead.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './+state';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { PassengerModule } from './passenger/passenger.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FlightBookingModule,

    PassengerModule,

    ReactiveFormsModule,

    BrowserAnimationsModule,
    FlightCancellingModule,

    FlightLibModule.forRoot(),
    SharedModule.forRoot(),

    RouterModule.forRoot(APP_ROUTES),

    // [Action] ---> Store ---> m1 --> m2 --> m3 --> Reducer
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    HomeComponent,
    BasketComponent,
    FlightLookaheadComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
