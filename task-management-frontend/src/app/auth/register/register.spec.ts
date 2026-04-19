import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Registe } from './register';

describe('Registe', () => {
  let component: Registe;
  let fixture: ComponentFixture<Registe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registe],
    }).compileComponents();

    fixture = TestBed.createComponent(Registe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
