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
    component: SigninComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'terms',
    component: TermsComponent
  },
  {
    path: '**',
    component: NotfoundComponent
  }
];
