import { BehaviorSubject, Observable } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';

export interface ElevationQueryParams {
  collection: string;
  limit?: number;
}

export class Elevation {
  private _loading = new BehaviorSubject(false);
  private _items = new BehaviorSubject([]);
  private _done = new BehaviorSubject(false);

  loading: Observable<boolean> = this._loading.asObservable();
  items: BehaviorSubject<any> = new BehaviorSubject([]);
  done: Observable<boolean> = this._done.asObservable();

  queryParams: BehaviorSubject<ElevationQueryParams> = new BehaviorSubject(null);

  constructor(private elevator, params: ElevationQueryParams) {
    this.reevaluate(params);
    this.update();
  }

  reevaluate(params) {
    this.queryParams.next(params);
  }

  more() {
    this.update(true);
  }

  private cursor() {
    const current = this._items.value;

    if (current.length) {
      return current[current.length - 1].doc;
    }

    return null;
  }

  // TODO query

  private query(next?) {
    return this.queryParams.pipe(switchMap(({ collection }) => {
      return this.elevator.mall.collection(collection, ref => {
        let query = ref;

        if (next) {
          query = query.startAfter(this.cursor());
        }

        return query.limit(5);
      }).pipe(take(1));
    }));
  }

  private scan(values) {
    this._items.next(values);
    this.items.next([...this.items.value, ...values]);
  }

  private update(next?) {
    if (this._done.value || this._loading.value) { return; }
    this._loading.next(true);
    const col = this.query(next);

    return col.subscribe((values: any) => {
      if (values.length) {
        this.scan(values);
      } else {
        this._done.next(true);
      }

      this._loading.next(false);
    });
  }

}
