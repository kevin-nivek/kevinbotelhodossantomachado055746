import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
   {
    path: 'login',
    component: LoginPage
  },
  {
    path: '',
    loadChildren: () =>
    import('./modules/pets/pets.routes').then(m => m.PET_ROUTES),
    canActivate: [authGuard]
  },

    {
    path: 'pets/:id',
    loadComponent: () =>
    import('./modules/pets/pages/detail/pet-detail.page').then(m => m.PetDetailPage),
    canActivate: [authGuard]
  }

];
