import { Injectable } from '@angular/core';

import { Elevation } from './elevation';
import { Mall } from './mall.service';

@Injectable({
  providedIn: 'root'
})
export class Elevator {
  constructor(private mall: Mall) {}
  elevations: Elevation[] = [];

  summon(collection): Elevation {
    const elevation = new Elevation(this, collection);
    this.elevations.push(elevation);
    return elevation;
  }
}
