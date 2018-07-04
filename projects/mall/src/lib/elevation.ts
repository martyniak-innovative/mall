import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

export class Elevation {
  private _loading = new BehaviorSubject(false);
  private _done = new BehaviorSubject(false);
  private _items = new BehaviorSubject([]);

  loading: Observable<boolean> = this._loading.asObservable();
  done: Observable<boolean> = this._done.asObservable();
  items: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private elevator, private collection: string) {
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

  private scan(values) {
    this._items.next(values);
    this.items.next([...this.items.value, ...values]);
  }

  private update(next?) {
    if (this._done.value || this._loading.value) { return; }
    this._loading.next(true);
    const col = this.query(next);

    return col.pipe(take(1))
      .subscribe(values => {
        if (values.length) {
          this.scan(values);
        } else {
          this._done.next(true);
        }

        this._loading.next(false);
      });
  }

}
