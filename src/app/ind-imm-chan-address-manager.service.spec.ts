import { TestBed } from '@angular/core/testing';

import { IndImmChanAddressManagerService } from './ind-imm-chan-address-manager.service';

describe('IndImmChanAddressManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndImmChanAddressManagerService = TestBed.get(IndImmChanAddressManagerService);
    expect(service).toBeTruthy();
  });
});
