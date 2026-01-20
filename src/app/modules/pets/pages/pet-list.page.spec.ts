import { TestBed } from "@angular/core/testing"

it('Teste de criação de pagina PetListPage', () => {
  const fixture = TestBed.createComponent(PetListPage);
  const component = fixture.componentInstance;
  expect(component).toBeTruthy();
});

import { PetListPage } from "./pet-list.page";
