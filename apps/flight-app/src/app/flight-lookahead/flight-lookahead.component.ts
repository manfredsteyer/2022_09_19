import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

// pipe-operator
// import { debounceTime, distinctUntilChanged, filter, map, startWith, switchMap, tap, withLatestFrom }
// from 'rxjs/operators';

// Ab RxJS 7: Alles in rxjs
import {
  combineLatest,
  interval,
  Observable,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  switchMap,
  tap,
  withLatestFrom,
  shareReplay,
  BehaviorSubject,
  delay,
  mergeMap,
  concatMap,
  exhaustMap,
  catchError,
  of,
  Subject,
  takeUntil,
  ObjectUnsubscribedError,
} from 'rxjs';

import { Flight } from '@flight-workspace/flight-lib';
import { Router } from '@angular/router';


function log<T>(info: string) {
    return (input$: Observable<T>) => {
        return input$.pipe(tap(v => console.log('log', info, v)));
    }
}

function rawLog<T>(info: string) {
    return (input$: Observable<T>) => {

        return new Observable<T>((observer) => {

            const subscription = input$.subscribe({
                next: (next) => {
                    console.log('log:next', info, next)
                    observer.next(next);
                },
                error: (err) => {
                    console.log('log:error', info, err)
                    observer.error(err);
                },
                complete: () => {
                    console.log('log:complete', info)
                    observer.complete();
                }
            });

            return () => {
                subscription.unsubscribe();
            }

        });
    }
}

function rawMap<T, U>(transform: (input: T) => U ) {
    return (input$: Observable<T>) => {

        return new Observable<U>((observer) => {

            const subscription = input$.subscribe({
                next: (next) => {
                    observer.next(transform(next));
                },
                error: (err) => {
                    observer.error(err);
                },
                complete: () => {
                    observer.complete();
                }
            });

            return () => {
                subscription.unsubscribe();
            }

        });
    }
}

function funWithTap<T>() {
    return tap<T>(x => console.log('x', x));
}

// function log(input$: Observable<unknown>) {
//     return input$.pipe(tap(v => console.log('log', v)))
// }

@Component({
  selector: 'flight-lookahead',
  templateUrl: './flight-lookahead.component.html',
})
export class FlightLookaheadComponent implements OnInit, OnDestroy {
  control!: FormControl;
  flights$!: Observable<Flight[]>;

  loading$ = new BehaviorSubject<boolean>(false);

  online$!: Observable<boolean>;

  errors$ = new Subject<unknown>();

  destroy$ = new Subject<void>();

  constructor(private http: HttpClient) {
    // router.events.subscribe(x => )
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // 1. Quellen -> $
  // 2. Seken -> $
  // 3. Q -> pipe -> S
  // 4. hot? (shareReplay ...)

  ngOnInit() {
    this.control = new FormControl();

    this.online$ = interval(2000).pipe(
      // -1..0..1..2..3..


      startWith(-1),
      
      rawLog('before converting to boolean'),

      //   tap((tick) => console.log('tick', tick)),
      rawMap(() => Math.random() < 0.5), // t, t, t, f, f, t
      
      rawLog('after converting to boolean'),

      distinctUntilChanged(), // t, f, t
      //   shareReplay(1),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    // Manual Subscription
    // this.online$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((v) => console.log('got value', v));

    const input$ = this.control.valueChanges.pipe(
      filter((v) => v.length >= 3),
      debounceTime(300)
    );

    // RxJS 7
    this.flights$ = combineLatest({ input: input$, online: this.online$ }).pipe(
      filter((combined) => combined.online),
      funWithTap(),
      tap(() => this.loading$.next(true)),
      switchMap((combined) => this.load(combined.input)),
      tap(() => this.loading$.next(false))
    );

    // this.flights$ = input$.pipe(
    //     withLatestFrom(this.online$),
    //     filter( ([, online]) => online),
    //     tap(() => this.loading = true),
    //     switchMap(([input,]) => this.load(input)),
    //     tap(() => this.loading = false)
    // )
  }

  load(from: string) {
    const url = 'http://www.angular.at/api/flight';

    const params = new HttpParams().set('from', from);

    const headers = new HttpHeaders().set('Accept', 'application/json');

    return this.http.get<Flight[]>(url, { params, headers }).pipe(
      // delay(7000),
      catchError((error) => {
        console.error('error', error);
        this.errors$.next(error);
        return of([]);
      })
    );
  }
}
