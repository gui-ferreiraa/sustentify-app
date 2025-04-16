import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileUpdateFormComponent } from './profile-update-form.component';

describe('ProfileUpdateFormComponent', () => {
  let component: ProfileUpdateFormComponent;
  let fixture: ComponentFixture<ProfileUpdateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileUpdateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
