import { TestBed, inject } from '@angular/core/testing';

import { ElevatorService } from './elevator.service';

describe('ElevatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElevatorService]
    });
  });

  it('should be created', inject([ElevatorService], (service: ElevatorService) => {
    expect(service).toBeTruthy();
  }));
});
