import { TestBed } from '@angular/core/testing';

import { SetTokenInterceptor } from './set-token.interceptor';

describe('SetTokenInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SetTokenInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: SetTokenInterceptor = TestBed.inject(SetTokenInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
