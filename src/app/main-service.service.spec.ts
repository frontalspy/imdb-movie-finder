/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MainService } from './main-service.service';

describe('MainService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MainService]
    });
  });

  it('should ...', inject([MainServiceService], (service: MainServiceService) => {
    expect(service).toBeTruthy();
  }));
});
