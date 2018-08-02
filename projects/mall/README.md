# 🔥🏬 Mall 

helper for angular firestore (on top angularfire2) with pagination and simpler query syntax

#### todo for mall-1.0.0

- improve multi-collection pagination
- docs
- tests

### example

```ts
import { Component, OnInit } from '@angular/core';
import { Mall } from '@inovative/mall';

@Component({
	template: `
		<ul>
			<li *ngFor="let store of stores | async">
				<button (click)="delete(store)">usuń: </button>
				<span>{{ store.doc.id }}</span>
			</li>
		</ul>
	`
})  
export class Component implements OnInit {
    constructor(private mall: Mall) { }
    stores: Observable<any>; // [{ ..., doc }, { ..., doc }]
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

### query (firestore syntax or custom mall syntax)

#### firestore syntax

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

#### custom mall syntax

```ts
export class Component implements OnInit {
    constructor(private mall: Mall) { }
    @Input() owner: string;
    @Input() limit: number;
    stores: Observable<any>;

    ngOnInit() {
        const { owner, limit } = this;

        this.stores = this.mall.collection('store', {
            where: { owner },
            limit            
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
