import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProject } from './home-project';

describe('HomeProject', () => {
  let component: HomeProject;
  let fixture: ComponentFixture<HomeProject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProject],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeProject);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
