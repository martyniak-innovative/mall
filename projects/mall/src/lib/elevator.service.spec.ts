import { TestBed, inject } from '@angular/core/testing';

import { Elevator } from './elevator.service';

describe('ElevatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Elevator]
    });
  });

  it('should be created', inject([Elevator], (service: Elevator) => {
    expect(service).toBeTruthy();
  }));
});
