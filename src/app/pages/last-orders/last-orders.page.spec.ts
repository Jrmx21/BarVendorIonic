import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LastOrdersPage } from './last-orders.page';

describe('LastOrdersPage', () => {
  let component: LastOrdersPage;
  let fixture: ComponentFixture<LastOrdersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LastOrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
