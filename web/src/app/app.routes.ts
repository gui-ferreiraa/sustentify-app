import { Routes } from '@angular/router';
import { HomeComponent } from './pages/public/home/home.component';
import { NotfoundComponent } from './pages/public/notfound/notfound.component';
import { AboutComponent } from './pages/public/about/about.component';
import { ProductsComponent } from './pages/public/products/products.component';
import { ProductsTrendingsComponent } from './pages/public/products-trendings/products-trendings.component';
import { ProductDetailsComponent } from './pages/public/product-details/product-details.component';
import { ContactComponent } from './pages/public/contact/contact.component';
import { SigninComponent } from './pages/public/signin/signin.component';
import { SignupComponent } from './pages/public/signup/signup.component';
import { TermsComponent } from './pages/public/terms/terms.component';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { AutoLoginGuard } from './core/guards/auth/auto-login.guard';
import { ProfileComponent } from './pages/private/profile/profile.component';
import { OverviewComponent } from './pages/private/overview/overview.component';

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
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'products/trending',
    component: ProductsTrendingsComponent
  },
  {
    path: 'products/:productId',
    component: ProductDetailsComponent
  },
  {
    path: 'products',
    component: ProductsComponent
  },
  {
    path: 'signin',
    component: SigninComponent,
    canActivate: [AutoLoginGuard]
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [AutoLoginGuard]
  },
  {
    path: 'terms',
    component: TermsComponent
  },
  // privates
  {
    path: 'profile/overview/:productId',
    component: OverviewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: NotfoundComponent
  }
];
