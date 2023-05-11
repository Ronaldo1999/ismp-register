import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementcrutialComponent } from './elementcrutial.component';

describe('ElementcrutialComponent', () => {
  let component: ElementcrutialComponent;
  let fixture: ComponentFixture<ElementcrutialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElementcrutialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElementcrutialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
