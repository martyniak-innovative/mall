import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MallService {
  constructor(private db: AngularFirestore) { }

  collection(collection, queryFn?): Observable<any> {
    return this.db.collection(collection, ref => this.query(ref, queryFn))
      .snapshotChanges().pipe(this.extract());
  }

  document(document): Observable<any> {
    return this.db.doc(document).snapshotChanges()
      .pipe(map(item => this.extractOne(item.payload)));
  }

  add(collection, data): Promise<any> {
    return this.db.collection(collection).add(data);
  }

  by(collection, property, value, inject?): Observable<any> {
    return this
      .collection(collection, q => q.where(property, '==', value))
      .pipe(map(arr => {
        const doc = arr[0];

        if (doc && inject) {
          Object.assign(doc, inject);
        }

        return doc;
      }));
  }

  private query(ref, fn) {
    return fn ? fn(ref) : ref;
  }

  private extract() {
    return map((items: any[]) =>
      items.map(item => this.extractOne(item.payload.doc))
    );
  }

  private extractOne(doc) {
    return { ...doc.data(), doc };
  }
}
