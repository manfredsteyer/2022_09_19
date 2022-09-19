import {Component} from '@angular/core';
import { interval, Observable, Observer } from 'rxjs';


function createIntervallObs(start: number): Observable<number> {
  return new Observable<number>((observer: Observer<number>) => {

    let counter = start;
    const interval = setInterval(() => {
      console.log('sending', counter);
      observer.next(counter);
      counter++;
    }, 1000);

    return () => {
      clearInterval(interval);
    };

  });
}


@Component({
  selector: 'flight-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {
    // const subscription1 = createIntervallObs(0).subscribe((counter) => {
    //   console.log('receiver got', counter);
    // });

    // const subscription2 = createIntervallObs(1000).subscribe((counter) => {
    //   console.log('receiver got', counter);
    // });

    // setTimeout(() => {
    //   subscription1.unsubscribe();
    //   subscription2.unsubscribe();

    // }, 7000);
  }
}
