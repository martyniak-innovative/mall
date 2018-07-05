import { TestBed, inject } from '@angular/core/testing';

import { Mall } from './mall.service';

describe('MallService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Mall]
    });
  });

  it('should be created', inject([Mall], (service: Mall) => {
    expect(service).toBeTruthy();
  }));
});
