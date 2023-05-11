import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceoaciComponent } from './referenceoaci.component';

describe('ReferenceoaciComponent', () => {
  let component: ReferenceoaciComponent;
  let fixture: ComponentFixture<ReferenceoaciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferenceoaciComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferenceoaciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
