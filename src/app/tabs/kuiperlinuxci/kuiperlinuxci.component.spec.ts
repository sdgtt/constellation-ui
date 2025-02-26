import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KuiperlinuxciComponent } from './kuiperlinuxci.component';

describe('KuiperlinuxciComponent', () => {
  let component: KuiperlinuxciComponent;
  let fixture: ComponentFixture<KuiperlinuxciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KuiperlinuxciComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KuiperlinuxciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
