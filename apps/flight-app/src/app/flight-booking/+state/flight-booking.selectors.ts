import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromFlightBooking from './flight-booking.reducer';
import { FlightBookingAppStateSlice, flightBookingFeatureKey } from './flight-booking.reducer';

export const selectFlightBookingState = createFeatureSelector<fromFlightBooking.FlightBookingState>(
  fromFlightBooking.flightBookingFeatureKey
);

export const selectFlights3 = createSelector(
  selectFlightBookingState,
  fbs => fbs.flights
);

export const selectSkipList = createSelector(
  selectFlightBookingState,
  fbs => fbs.skip
);

export const selectFlights4 = createSelector(
  selectFlights3,
  selectSkipList,
  (flights, skip) => flights.filter(f => !skip.includes(f.id))
    // ^^^ ViewModel
);

export const selectFlights = 
  (appState: fromFlightBooking.FlightBookingAppStateSlice) => 
    appState[flightBookingFeatureKey].flights;


export const selectFlights2 = createSelector(
  (appState: FlightBookingAppStateSlice) => appState[flightBookingFeatureKey].flights,
  (appState: FlightBookingAppStateSlice) => appState[flightBookingFeatureKey].skip,
  (flights, skip) => flights.filter(f => !skip.includes(f.id))
    // ^^^ ViewModel
);