import { Routes } from "@angular/router";
import { TutorListPage } from "./pages/tutor-list.page";
import { TutorFormPage } from "./pages/form/tutor-form.page";

export const TUTORES_ROUTES: Routes = [
  {
    path: '',
    component: TutorListPage
  },

  {
    path: ':id',
    loadComponent: () =>
    import('./pages/detail/tutor-detail.page').then(m => m.TutorDetailPage)
  }
];
