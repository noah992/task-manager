import { TestBed } from '@angular/core/testing';

import { UpgradeGuard } from './upgrade.guard';

describe('UpgradeGuard', () => {
  let guard: UpgradeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UpgradeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
