import { BehaviorSubject, Observable } from 'rxjs';
import { take, scan } from 'rxjs/operators';

export class Elevation {
  private _loading = new BehaviorSubject(false);
  private _done = new BehaviorSubject(false);
  private _items = new BehaviorSubject([]);

  loading: Observable<boolean> = this._loading.asObservable();
  items: Observable<any[]>;
  done: Observable<boolean> = this._done.asObservable();

  constructor(private elevator, private collection: string) {
    this.items = this._items.asObservable().pipe(
      scan((items, newItems) => [...items, ...newItems]),
    );

    this.update();
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
    return this.elevator.mall.collection(this.collection, ref => {
      let query = ref;

      if (next) {
        query = query.startAfter(this.cursor());
      }

      return query.limit(5);
    });
  }

  private update(next?) {
    if (this._done.value || this._loading.value) { return; }
    const col = this.query(next);

    this._loading.next(true);

    return col.pipe(take(1))
      .subscribe(values => {
        this._items.next(values);
        this._loading.next(false);

        if (!values.length) {
          this._done.next(true);
        }
      });
  }

}
