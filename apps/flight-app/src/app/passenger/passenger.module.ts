import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store, StoreModule } from '@ngrx/store';
import * as fromPassenger from './passenger.reducer';
import { addPassenger } from './passenger.actions';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromPassenger.passengersFeatureKey, fromPassenger.reducer)
  ]
})
export class PassengerModule { 

  constructor(private store: Store<fromPassenger.PassengerSlice>) {
    store.dispatch(addPassenger({ passenger: {
      id: '4711',
      firstName: 'MAx',
      lastName: 'Muster',
      status: 'FQT'
    }}));
    
    store.select(a => a[fromPassenger.passengersFeatureKey].entities).subscribe(e => {
      console.log('entities', e);
    });

    store.select(a => a[fromPassenger.passengersFeatureKey].ids).subscribe(ids => {
      console.log('ids', ids);
    });

    store.select(fromPassenger.selectAllPassengers).subscribe(ids => {
      console.log('ids', ids);
    });

    

  }

}
