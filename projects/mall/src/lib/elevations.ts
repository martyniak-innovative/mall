import { BehaviorSubject, Observable, combineLatest } from 'rxjs';

import { Elevation, ElevationQueryParams } from './elevation';
import { Elevator } from './elevator.service';
import { switchMap, map, take } from 'rxjs/operators';

export class Elevations {
  private _elevations: BehaviorSubject<Elevation[]> = new BehaviorSubject([]);

  loading: Observable<boolean>;
  amount: Observable<number>;
  done: Observable<boolean>;
  items: Observable<any[]>;

  constructor(private elevator: Elevator, elevations: Elevation[]) {
    this._elevations.next(elevations);

    this.setup();
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

  private combine(prop) {
    return this._elevations.asObservable().pipe(
      switchMap(elevations =>
        combineLatest(...elevations.map(ev => ev[prop]))
      )
    );
  }

  private setup() {
    this.items = this.combine('items')
      .pipe(map(items => this.mixItems(items)));

    this.loading = this.combine('loading').pipe(
      map((bools: boolean[]) => bools.find(bool => bool === true) || false));

    this.done = this.combine('done').pipe(
      map(bools => bools.every(bool => bool === true) || false));

    this.amount = this.combine('done').pipe(
      map((bools: boolean[]) => bools.reduce((prev, bool) => prev + (bool ? 1 : 0), 0))
    );
  }

  private mixItems(items) {
    let _items = [];
    let length = 0;

    items.forEach(item => {
      if (item.length > length) {
        length = item.length;
      }
    });

    for (let i = 0; i < length; i++) {
      items.forEach(item => {
        if (item[i]) {
          _items = [..._items, item[i] ];
        }
      });
    }

    return _items;
  }
}
