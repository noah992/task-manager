import { TestBed } from '@angular/core/testing';

import { UpgradeResolver } from './upgrade.resolver';

describe('UpgradeResolver', () => {
  let resolver: UpgradeResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(UpgradeResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
