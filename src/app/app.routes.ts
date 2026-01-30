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
  },

  {
    path: 'pets/:id/edit',
    loadComponent: () =>
    import('./modules/pets/pages/form/pet-form.page').then(m => m.PetFormPage),
    canActivate: [authGuard]
  },

  {
    path: 'new/pets',
    loadComponent: () =>
    import('./modules/pets/pages/form/pet-form.page').then(m => m.PetFormPage),
    canActivate: [authGuard]
  },

  {
    path: 'tutores',
    loadChildren: () => import('./modules/tutores/tutores.routes')
    .then(m => m.TUTORES_ROUTES),
    canActivate: [authGuard]
  },

  {
    path: 'tutores/:id/edit',
    loadComponent: () =>
    import('./modules/tutores/pages/form/tutor-form.page').then(m => m.TutorFormPage),
    canActivate: [authGuard]
  },

  {
    path: 'new/tutores',
    loadComponent: () =>
    import('./modules/tutores/pages/form/tutor-form.page').then(m => m.TutorFormPage),
    canActivate: [authGuard]
  },

];
