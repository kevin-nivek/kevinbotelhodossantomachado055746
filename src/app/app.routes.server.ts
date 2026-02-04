import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'pets/:id',
    renderMode: RenderMode.Client
  },

  {
    path: 'tutores/:id',
    renderMode: RenderMode.Client
  },

  {
    path: 'pets/:id/edit',
    renderMode: RenderMode.Client
  },
  {
    path: 'tutores/:id/edit',
    renderMode: RenderMode.Client
  },

  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
