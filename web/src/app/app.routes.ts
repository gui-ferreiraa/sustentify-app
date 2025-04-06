import { Routes } from '@angular/router';
import { HomeComponent } from './pages/public/home/home.component';
import { NotfoundComponent } from './pages/public/notfound/notfound.component';
import { AboutComponent } from './pages/public/about/about.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: '**',
    component: NotfoundComponent
  }
];
