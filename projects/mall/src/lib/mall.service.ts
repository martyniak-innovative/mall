import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { mallQuery } from './query';

@Injectable({
  providedIn: 'root'
})
export class Mall {
  constructor(private db: AngularFirestore) { }

  collection(collection, query?, inject?): Observable<any> {
    return this.db.collection(collection, ref => this.query(ref, query))
      .snapshotChanges().pipe(this.extract(inject));
  }

  document(document, inject?): Observable<any> {
    return this.db.doc(document).snapshotChanges()
      .pipe(map(item => this.extractOne(item.payload, inject)));
  }

  add(collection, data): Promise<any> {
    return this.db.collection(collection).add(data);
  }

  private query(ref, query) {
    if (typeof query === 'function') {
      return query(ref);
    } else {
      return mallQuery(ref, query);
    }
  }

  private extract(inject?) {
    return map((items: any[]) =>
      items.map(item => this.extractOne(item.payload.doc, inject))
    );
  }

  private extractOne(doc, inject?) {
    return { ...doc.data(), doc, ...inject };
  }
}
