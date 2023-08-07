import { TestBed } from '@angular/core/testing';

import { UserSocketService } from './user-socket.service';

describe('UserSocketService', () => {
  let service: UserSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
