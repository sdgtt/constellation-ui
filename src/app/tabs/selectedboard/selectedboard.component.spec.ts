import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedboardComponent } from './selectedboard.component';

describe('SelectedboardComponent', () => {
  let component: SelectedboardComponent;
  let fixture: ComponentFixture<SelectedboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
