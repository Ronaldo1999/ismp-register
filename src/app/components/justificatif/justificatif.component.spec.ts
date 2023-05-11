import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificatifComponent } from './justificatif.component';

describe('JustificatifComponent', () => {
  let component: JustificatifComponent;
  let fixture: ComponentFixture<JustificatifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JustificatifComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JustificatifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
