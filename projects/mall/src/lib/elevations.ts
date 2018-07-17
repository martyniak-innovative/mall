import { BehaviorSubject, Observable, combineLatest } from 'rxjs';

import { Elevation, ElevationQueryParams } from './elevation';
import { Elevator } from './elevator.service';
import { switchMap, map, take } from 'rxjs/operators';

export class Elevations {
  private _elevations: BehaviorSubject<Elevation[]> = new BehaviorSubject([]);

  loading: Observable<boolean>;
  items: Observable<any[]>;
  done: Observable<boolean>;
  amount: Observable<number>;

  constructor(private elevator: Elevator, elevations: Elevation[]) {
    this._elevations.next(elevations);

    this.setup();
  }

  setup() {
    this.items = this.combine('items').pipe(
      map((items: any) => items[0].concat(...items.slice(1))));

    this.loading = this.combine('loading').pipe(
      map((bools: boolean[]) => bools.find(bool => bool === true) || false));

    this.done = this.combine('done').pipe(
      map(bools => bools.every(bool => bool === true) || false));

    this.amount = this.combine('done').pipe(
      map((bools: boolean[]) => bools.reduce((prev, bool) => prev + (bool ? 1 : 0), 0))
    );
  }

  private combine(prop) {
    return this._elevations.asObservable().pipe(
      switchMap(elevations =>
        combineLatest(...elevations.map(ev => ev[prop]))
      )
    );
  }

  more() {
    this._elevations.value.forEach(elevation => {
      this.amount.pipe(take(1)).subscribe((amount) =>
        elevation.more(amount)
      );
    });
  }

  reevaluate(params: ElevationQueryParams[]) {
    const elevations = [];

    params.forEach((_params, i) => {
      elevations[i] = this.elevator.summon('opus', this.elevator.unifyParams(_params, params.length));
    });

    this._elevations.next(elevations);
  }
}
