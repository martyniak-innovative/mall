# 🏬 Mall 

angular firestore helper with pagination support

```ts
  import { Component, OnInit } from '@angular/core';
  import { Mall } from '@inovative/mall';

  @Component({...})
  export class Component implements OnInit {
    constructor(private mall: Mall) { }
    items: Observable<any>; // [{ ..., doc }, { ..., doc }, ...]
    collection = 'store';

    ngOnInit() {
      this.items = this.mall.collection(this.collection);
    }

    edit(item, value) {
      item.doc.ref.update(value)
        .then(() => {/* success */});
    }

    delete(item) {
      item.doc.ref.delete()
        .then(() => {/* success */});
    }

    add(store) {
      this.mall.add(this.collection, store)
        .then(() => {/* success */});
    }
  }
```
