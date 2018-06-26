import { TestBed, inject } from '@angular/core/testing';

import { MallService } from './mall.service';

describe('MallService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MallService]
    });
  });

  it('should be created', inject([MallService], (service: MallService) => {
    expect(service).toBeTruthy();
  }));
});
