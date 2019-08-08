import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndImmChanPostViewerComponent } from './ind-imm-chan-post-viewer.component';

describe('IndImmChanPostViewerComponent', () => {
  let component: IndImmChanPostViewerComponent;
  let fixture: ComponentFixture<IndImmChanPostViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndImmChanPostViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndImmChanPostViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
