import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MenuComponent,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Cria o MenuComponent', () => {
    expect(component).toBeTruthy();
  });

  it('Testa se tem 4 links', () => {
    const links = fixture.debugElement.queryAll(By.css('a'));
    expect(links.length).toBe(4);
  });

  it('Link /pets', () => {
    const link = fixture.debugElement.queryAll(By.css('a'))[0];
    expect(link.attributes['routerLink']).toBe('/pets');
  });

  it('Link  /tutores', () => {
    const link = fixture.debugElement.queryAll(By.css('a'))[1];
    expect(link.attributes['routerLink']).toBe('/tutores');
  });

  it('Link /new/pets', () => {
    const link = fixture.debugElement.queryAll(By.css('a'))[2];
    expect(link.attributes['routerLink']).toBe('/new/pets');
  });

  it('Link /new/tutores', () => {
    const link = fixture.debugElement.queryAll(By.css('a'))[3];
    expect(link.attributes['routerLink']).toBe('/new/tutores');
  });
});
