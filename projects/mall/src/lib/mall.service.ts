import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Mall {
  constructor(private db: AngularFirestore) { }

  collection(collection, queryFn?, inject?): Observable<any> {
    return this.db.collection(collection, ref => this.query(ref, queryFn))
      .snapshotChanges().pipe(this.extract(inject));
  }

  by(collection, property, value, inject?): Observable<any> {
    return this.collection(collection, q => q.where(property, '==', value), inject);
  }

  add(collection, data): Promise<any> {
    return this.db.collection(collection).add(data);
  }

  document(document, inject?): Observable<any> {
    return this.db.doc(document).snapshotChanges()
      .pipe(
        map(item => this.extractOne(item.payload, inject),
    ));
  }

  private query(ref, fn) {
    return fn ? fn(ref) : ref;
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
