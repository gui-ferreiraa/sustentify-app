import { Component, OnInit, signal } from '@angular/core';
import { TitleDisplayComponent } from "../../../core/components/title-display/title-display.component";
import { TextColor } from '../../../core/types/enums';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonGreenComponent } from "../../../core/components/button-green/button-green.component";
import { PrimaryInputComponent } from "../../../core/components/inputs/primary-input/primary-input.component";
import { AuthService } from '../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Meta, Title } from '@angular/platform-browser';

interface RecoverForm {
  email: FormControl;
}

@Component({
  selector: 'app-recover-password',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    TitleDisplayComponent,
    ButtonGreenComponent,
    PrimaryInputComponent
],
  templateUrl: './recover-password.component.html',
})
export class RecoverPasswordComponent implements OnInit{
  protected readonly recoverTexts = {
    title: 'Recuperar senha',
    titleColor: TextColor.black,
    subtitle: 'Digite seu e-mail para receber um link de recuperação',
    subtitleColor: TextColor.gray,
  }
  protected form!: FormGroup<RecoverForm>;
  protected btnDisabled = signal(false);
  protected isSuccess = signal(false);

  constructor(
    private readonly authService: AuthService,
    private readonly toastService: ToastrService,
    private readonly titleService: Title,
    private readonly metaService: Meta,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Recuperar senha | Sustentify');
    this.metaService.updateTag({
      name: 'description',
      content: 'Recuperar senha Sustentify',
    });

    this.form = new FormGroup<RecoverForm>({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const fields = this.form.getRawValue();
    const { email } = fields;
    this.btnDisabled.set(true);
    this.authService.recoverPassword(email).subscribe({
      next: (res) => {
        this.form.reset();
        this.toastService.success('E-mail enviado com sucesso!');
        this.isSuccess.set(true);
      },
      error: (err) => {
        console.log(err)
        if (err.status == 400) this.toastService.error('E-mail inválido!');
        if (err.status == 404) this.toastService.error('E-mail não encontrado!');
        else {
          this.toastService.error('Erro tente novamente mais tarde!');
        }
        this.btnDisabled.set(false);
      },
      complete: () => this.btnDisabled.set(false),
    });
  }
}
