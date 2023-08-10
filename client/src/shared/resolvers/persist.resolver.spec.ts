import { TestBed } from '@angular/core/testing';

import { PersistResolver } from './persist.resolver';

describe('PersistResolver', () => {
  let resolver: PersistResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(PersistResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
