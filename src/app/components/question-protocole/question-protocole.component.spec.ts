import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionProtocoleComponent } from './question-protocole.component';

describe('QuestionProtocoleComponent', () => {
  let component: QuestionProtocoleComponent;
  let fixture: ComponentFixture<QuestionProtocoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionProtocoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionProtocoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
