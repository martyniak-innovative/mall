import { Injectable } from '@angular/core';

import { Elevation, ElevationQueryParams } from './elevation';
import { Elevations } from './elevations';
import { Mall } from './mall.service';

@Injectable({
  providedIn: 'root'
})
export class Elevator {
  constructor(private mall: Mall) {}

  summonMany(collection: string, params: ElevationQueryParams[] = [{}]): Elevations {
    const elevations = params.map(_params =>
      this.summon(collection, this.unifyParams(_params, params.length)));

    return new Elevations(this, elevations);
  }

  summon(collection: string, params?: ElevationQueryParams): Elevation {
    return this.elevation(collection, params);
  }

  unifyParams(params: ElevationQueryParams, amount: number): ElevationQueryParams {
    const _params = { ...params };

    if (amount && _params.limit) {
      _params.limit = Math.floor(_params.limit / amount);
    }

    return _params;
  }

  private elevation(collection: string, params: ElevationQueryParams): Elevation {
    return new Elevation(this, { collection, ...params });
  }
}
