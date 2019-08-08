import { TestBed } from '@angular/core/testing';

import { IndImmChanPostManagerService } from './ind-imm-chan-post-manager.service';

describe('IndImmChanPostManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndImmChanPostManagerService = TestBed.get(IndImmChanPostManagerService);
    expect(service).toBeTruthy();
  });
});
