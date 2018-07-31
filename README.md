# 🏬 Mall 

angular firestore helper with pagination support and simpler query where syntax

```ts
  import { Component, OnInit } from '@angular/core';
  import { Mall } from '@inovative/mall';

  @Component({...})
  export class Component implements OnInit {
    constructor(private mall: Mall) { }
    stores: Observable<any>; // [{ ..., doc }, { ..., doc }, ...]
    collection = 'store';

    ngOnInit() {
      this.stores = this.mall.collection(this.collection);
    }

    edit(store, value) {
      store.doc.ref.update(value)
        .then(() => {/* success */});
    }

    delete(store) {
      store.doc.ref.delete()
        .then(() => {/* success */});
    }

    add(store) {
      this.mall.add(this.collection, store)
        .then(() => {/* success */});
    }
  }
```

## query

```ts
export class Component implements OnInit {
  constructor(private mall: Mall) { }
  @Input() owner: string;
  @Input() limit: number;
  stores: Observable<any>;

  ngOnInit() {
    this.stores = this.mall.collection('store', ref => {
      let query = ref;

      if (this.limit) {
        query = query.limit(this.limit);
      }

      if (this.owner) {
        query = query.where('owner', '==', this.owner);
      }

      return ref;
    });
  }
}
```

## pagination (experimental mutli collection querying)

```ts
import { Component, OnInit } from '@angular/core';
import { Elevator } from '@inovative/mall';

export class Component implements OnInit {
  constructor(private elevator: Elevator) { }
  loading: Observable<boolean>;
  done: Observable<boolean>;
  stores: Observable<any>;

  ngOnInit() {
    const elevation = this.elevator.summon('store', { limit: 4, where: { city: 'NY' } });

    this.loading = elevation.loading;
    this.stores = elevation.items;
    this.done = elevation.done;
    this.elevation = elevation;
  }

  searchByCategory(category) {
    this.elevation.reevaluate({ where: { category } });
  }

  loadMore() {
    this.elevation.more();
  }
}
```
### experimental

```ts
import { Component, OnInit } from '@angular/core';
import { Elevator } from '@inovative/mall';

export class Component implements OnInit {
  constructor(private elevator: Elevator) { }
  loading: Observable<boolean>;
  done: Observable<boolean>;
  stores: Observable<any>;

  ngOnInit() {
    const elevation = this.elevator.summonMany([
      { 
        collection: 'store', 
        limit: 4 
      }, 
      {
        collection: 'shop',
        limit: 3
      }
    ]);

    this.loading = elevation.loading;
    this.stores = elevation.items;
    this.done = elevation.done;
    this.elevation = elevation;
  }

  searchByCategory(category) {
    this.elevation.reevaluate([{ where: { category } }, { /* no changes for shop collection */ }]);
  }

  loadMore() {
    this.elevation.more();
  }
}
```
