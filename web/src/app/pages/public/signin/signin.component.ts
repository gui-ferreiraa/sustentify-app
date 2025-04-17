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
import { Router } from '@angular/router';
import { filter, take } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';

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
    }).subscribe({
      next: (vl) => {
        this.cookieService.setAccessToken(vl.accessToken);
        this.authService.getCompanyLogged();
        this.authService.isAuthenticated$
          .pipe(
            filter(Boolean),
            take(1)
          )
          .subscribe(() => {
            this.router.navigate(['/dashboard'])
          })
      },
      error: (err) => {
        console.log(err);
        if (err.error.status == "NOT_FOUND") this.toastService.error("Email não encontrado");
        else if (err.error.status == "BAD_REQUEST") this.toastService.error("Email ou senha inválidos");
        else if (err.error.status == "UNAUTHORIZED") this.toastService.error("Email ou senha inválidos");
        else if (err.error.status == "FORBIDDEN") this.toastService.error("Email ou senha inválidos");
        else this.toastService.error("Erro ao fazer login, tente novamente mais tarde.");

        this.btnDisabled.set(false);
      },
      complete: () => this.btnDisabled.set(false),
    })
  }
}
