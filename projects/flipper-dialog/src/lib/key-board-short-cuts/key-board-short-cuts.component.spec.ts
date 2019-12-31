import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyBoardShortCutsComponent } from './key-board-short-cuts.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
export const dialogRefSpy = () => jasmine.createSpyObj('MatDialogRef', ['close']);
describe('KeyBoardShortCutsComponent', () => {
  let component: KeyBoardShortCutsComponent;
  let fixture: ComponentFixture<KeyBoardShortCutsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyBoardShortCutsComponent ],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: dialogRefSpy()},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyBoardShortCutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
