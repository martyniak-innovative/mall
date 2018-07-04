import { Injectable } from '@angular/core';

import { Elevation, ElevationQueryParams } from './elevation';
import { Mall } from './mall.service';

@Injectable({
  providedIn: 'root'
})
export class Elevator {
  constructor(private mall: Mall) {}
  elevations: Elevation[] = [];

  summon(params: ElevationQueryParams): Elevation {
    const elevation = new Elevation(this, params);
    this.elevations.push(elevation);
    return elevation;
  }
}
