import { Flight } from '@flight-workspace/flight-lib';
import { Action, createReducer, on } from '@ngrx/store';
import * as FlightBookingActions from './flight-booking.actions';
import { flightsLoaded, updateFlight } from './flight-booking.actions';

export const flightBookingFeatureKey = 'flightBooking';

export interface FlightBookingAppStateSlice {
  [flightBookingFeatureKey]: FlightBookingState;
}

export interface FlightBookingState {
  flights: Flight[];
  basket: object;
  stats: object;
  skip: number[]; 
}

export const initialState: FlightBookingState = {
  flights: [],
  basket: {},
  stats: {},
  skip: [4]
};

export const reducer = createReducer(
  initialState,

  on(flightsLoaded, (state, action) => {
    const flights = action.flights;
    return { ...state, flights };
  }),

  on(updateFlight, (state, action) => {
    const flight = action.flight;
    const flights = state.flights.map(f => f.id === flight.id? flight : f);
    return { ...state, flights };
  }),

);
