import { TestBed } from '@angular/core/testing';

import { SecureinnerpageGuard } from './secureinnerpage.guard';

describe('SecureinnerpageGuard', () => {
  let guard: SecureinnerpageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SecureinnerpageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
