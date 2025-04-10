import { Component } from '@angular/core';
import { TitleDisplayComponent } from "../../../core/components/title-display/title-display.component";
import { TextColor } from '../../../core/types/enums';
import { PrimaryInputComponent } from "../../../core/components/inputs/primary-input/primary-input.component";
import { ButtonGreenComponent } from "../../../core/components/button-green/button-green.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from '../../../services/cookies/cookie.service';
import { Router } from '@angular/router';
import { filter, take } from 'rxjs';

interface SigninForm {
  email: FormControl;
  password: FormControl;
}

@Component({
  selector: 'app-signin',
  imports: [
    TitleDisplayComponent,
    PrimaryInputComponent,
    ButtonGreenComponent,
    ReactiveFormsModule,
    NgOptimizedImage
  ],
  templateUrl: './signin.component.html',
})
export class SigninComponent {
  signinTexts = {
    title: 'Acesse sua conta',
    subtitle: 'Entre e Comece a Transformar o Impacto Ambiental da Sua Empresa',
    titleColor: TextColor.black,
    subtitleColor: TextColor.gray
  }

  form!: FormGroup<SigninForm>;

  constructor(
    private readonly authService: AuthService,
    private readonly toastService: ToastrService,
    private readonly cookieService: CookieService,
    private readonly router: Router,
  ) {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const fields = this.form.getRawValue();

    this.authService.login({
      email: fields.email,
      password: fields.password
    }).subscribe({
      next: (vl) => {
        this.cookieService.setAccessToken(vl.accessToken);
        this.authService.loadCompanyFromToken();
        this.authService.isAuthenticated$
          .pipe(
            filter(Boolean),
            take(1)
          )
          .subscribe(() => {
            this.router.navigate(['/profile'])
          })
      },
      error: (err) => {
        this.toastService.error(err.error.message);
      },
    })
  }
}
