import { TestBed } from '@angular/core/testing';

import { IndImmChanPostService } from './ind-imm-chan-post.service';

describe('IndImmChanPostService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndImmChanPostService = TestBed.get(IndImmChanPostService);
    expect(service).toBeTruthy();
  });
});
