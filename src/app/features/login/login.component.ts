import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styles: [`
    .login-wrapper {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #0b3b45 0%, #14919b 100%); padding: 16px;
    }
    .login-card { width: 100%; max-width: 400px; padding: 32px 28px; }
    .login-header { text-align: center; margin-bottom: 24px; }
    .login-header mat-icon { font-size: 44px; width: 44px; height: 44px; color: #14919b; }
    .login-header h1 { margin: 8px 0 4px; font-size: 24px; }
    .login-header p { margin: 0; color: #666; font-size: 14px; }
    .error-msg { color: #c62828; font-size: 13px; margin: 0 0 12px; text-align: center; }
  `]
})
export class LoginComponent {
  hide = true;
  loading = false;
  errorMsg = '';

  form = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMsg = '';
    const { correo, password } = this.form.value;

    this.auth.login(correo!, password!).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.mensaje ?? 'No se pudo iniciar sesión.';
      }
    });
  }
}
