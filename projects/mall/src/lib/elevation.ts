import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

export class Elevation {
  private _loading = new BehaviorSubject(false);
  private _done = new BehaviorSubject(false);
  private _items = new BehaviorSubject([]);

  loading: Observable<boolean> = this._loading.asObservable();
  items: Observable<any[]> = this._items.asObservable();
  done: Observable<boolean> = this._done.asObservable();

  constructor(private elevator, private collection: string) {
    this.mapAndUpdate(this.query());
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
      let query = ref.orderBy('timestamp');

      if (next) {
        query = query.startAfter(this.cursor());
      }

      return query.limit(5);
    });
  }

  private mapAndUpdate(col: AngularFirestoreCollection<any>) {
    if (this._done.value || this._loading.value) { return; }

    this._loading.next(true);

    return col.snapshotChanges().pipe(take(1))
      .subscribe(values => {
        this._items.next(values);
        this._loading.next(false);
        // this.scan(values);
      });
  }

}
