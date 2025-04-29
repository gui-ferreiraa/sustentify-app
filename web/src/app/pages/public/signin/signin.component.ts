import { Component, OnInit, signal } from '@angular/core';
import { TitleDisplayComponent } from "../../../core/components/title-display/title-display.component";
import { TextColor } from '../../../core/types/enums';
import { PrimaryInputComponent } from "../../../core/components/inputs/primary-input/primary-input.component";
import { ButtonGreenComponent } from "../../../core/components/button-green/button-green.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from '../../../services/cookies/cookie.service';
import { Router, RouterModule } from '@angular/router';
import { filter, finalize, switchMap, take } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { IHttpError } from '../../../core/types/http-error';

interface SigninForm {
  email: FormControl;
  password: FormControl;
}

@Component({
  selector: 'app-signin',
  imports: [
    RouterModule,
    TitleDisplayComponent,
    PrimaryInputComponent,
    ButtonGreenComponent,
    ReactiveFormsModule,
    NgOptimizedImage
  ],
  templateUrl: './signin.component.html',
})
export class SigninComponent implements OnInit {
  signinTexts = {
    title: 'Acesse sua conta',
    subtitle: 'Entre e Comece a Transformar o Impacto Ambiental da Sua Empresa',
    titleColor: TextColor.black,
    subtitleColor: TextColor.gray
  }

  form!: FormGroup<SigninForm>;
  btnDisabled = signal(false);

  constructor(
    private readonly authService: AuthService,
    private readonly toastService: ToastrService,
    private readonly cookieService: CookieService,
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly metaService: Meta,
  ) {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
    this.titleService.setTitle('Login | Sustentify');
    this.metaService.updateTag({ name: 'description', content: 'Acesse sua conta Sustentify e comece a transformar o impacto ambiental da sua empresa.' });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const fields = this.form.getRawValue();

    this.btnDisabled.set(true);
    this.authService.login({
      email: fields.email,
      password: fields.password
    }).pipe(
      switchMap(vl => {
        this.cookieService.setAccessToken(vl.accessToken);

        return this.authService.getCompanyLogged();
      }),
      switchMap(() => this.authService.isAuthenticated$),
      filter(Boolean),
      take(1),
      finalize(() => this.btnDisabled.set(false))
    ).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => this.handleError(err)
    });
  }

  private handleError(err: IHttpError): void {
    const errorMessages: Record<string, string> = {
      404: "Email não encontrado",
      401: "Estamos validando seus dados, confira seu email!",
      403: "Estamos validando seus dados, volte mais tarde!",
    }

    const key = String(err.status);
    const message = errorMessages[key] || "Erro tente novamente mais tarde!";

    this.toastService.error(message);
  }
}
