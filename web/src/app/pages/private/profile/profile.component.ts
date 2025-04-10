import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Observable } from 'rxjs';
import { ICompany } from '../../../core/types/company';
import { AsyncPipe } from '@angular/common';
import { ButtonGreenComponent } from "../../../core/components/button-green/button-green.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [
    AsyncPipe,
    ButtonGreenComponent
],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  company$!: Observable<ICompany | null>;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.company$ = this.authService.company$;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/signin'])
  }
}
