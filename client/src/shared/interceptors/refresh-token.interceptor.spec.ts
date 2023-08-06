import { TestBed } from '@angular/core/testing';

import { RefreshTokenInterceptor } from './refresh-token.interceptor';

describe('RefreshTokenInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      RefreshTokenInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: RefreshTokenInterceptor = TestBed.inject(RefreshTokenInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
