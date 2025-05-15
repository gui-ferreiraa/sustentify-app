import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { TitleDisplayComponent } from "../../../core/components/title-display/title-display.component";
import { TextColor } from '../../../core/types/enums';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from "../../../core/components/inputs/primary-input/primary-input.component";
import { ButtonGreenComponent } from "../../../core/components/button-green/button-green.component";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ICompany } from '../../../core/types/company';
import { ToastrService } from 'ngx-toastr';
import { confirmPasswordValidator } from '../../../core/validators/confirmPassword.validator';
import { Meta, Title } from '@angular/platform-browser';
import { CookieService } from '../../../services/cookies/cookie.service';

interface UpdatePasswordForm {
  email: FormControl;
  password: FormControl;
  confirmPassword: FormControl;
}

@Component({
  selector: 'app-update-password',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    TitleDisplayComponent,
    PrimaryInputComponent,
    ButtonGreenComponent
],
  templateUrl: './update-password.component.html',
})
export class UpdatePasswordComponent implements OnInit{
  protected texts = {
    title: 'Atualizar senha',
    subtitle: 'Atualize sua senha de acesso ao sistema',
    titleColor: TextColor.black,
    subtitleColor: TextColor.gray,
  }
  protected btnDisabled = signal(false);
  protected form!: FormGroup<UpdatePasswordForm>;
  protected companyUpdated: WritableSignal<ICompany> = signal({} as ICompany);
  protected token = signal('');
  protected isTokenValid = signal(false);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastService: ToastrService,
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
    private readonly titleService: Title,
    private readonly metaService: Meta,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Atualizar senha | Sustentify');
    this.metaService.updateTag({ name: 'description', content: 'Atualize sua senha de acesso ao sistema' });

    this.route.params.subscribe(params => {
      this.token.set(params['token']);

      this.authService.verifyEmail(this.token()).subscribe({
        next: (response) => {
          this.companyUpdated.set(response);
          this.form = new FormGroup<UpdatePasswordForm>({
            email: new FormControl<string>({value: response.email, disabled: true}, [Validators.required]),
            password: new FormControl<string>('', [Validators.required]),
            confirmPassword: new FormControl<string>('', [Validators.required]),
          }, { validators: confirmPasswordValidator() });

          this.isTokenValid.set(true);
        },
        error: (error) => {
          this.toastService.error('Erro Sessão expirada ou inválida');
          this.router.navigate(['/404']);
        }
      });
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const fields = this.form.getRawValue();
    const { password } = fields;
    this.btnDisabled.set(true);
    this.authService.updatePassword(this.token(), password).subscribe({
      next: () => {
        this.toastService.success('Senha atualizada com sucesso!');
        this.router.navigate(['/signin']);
      },
      error: (error) => {
        this.toastService.error(error.error.message);
        this.btnDisabled.set(false);
      },
      complete: () => this.btnDisabled.set(false),
    });
  }
}
