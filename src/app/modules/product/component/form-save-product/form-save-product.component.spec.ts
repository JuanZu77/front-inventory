import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSaveProductComponent } from './form-save-product.component';

describe('FormSaveProductComponent', () => {
  let component: FormSaveProductComponent;
  let fixture: ComponentFixture<FormSaveProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormSaveProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormSaveProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
