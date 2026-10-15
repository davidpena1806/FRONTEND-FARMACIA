import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../models/entities';

export interface LoginResponse {
  token: string;
  tipo: string;
  expiraEnMs: number;
  usuario: Usuario;
}

const TOKEN_KEY = 'farmacia_token';
const USER_KEY = 'farmacia_user';
const EXP_KEY = 'farmacia_exp';

/** Maneja el inicio/cierre de sesión y guarda el JWT recibido de /api/auth/login. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<Usuario | null>(this.readUser());
  readonly user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(correo: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { correo, password })
      .pipe(
        tap((res) => {
          localStorage.setItem(TOKEN_KEY, res.token);
          localStorage.setItem(USER_KEY, JSON.stringify(res.usuario));
          localStorage.setItem(EXP_KEY, String(Date.now() + res.expiraEnMs));
          this.userSubject.next(res.usuario);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXP_KEY);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  get currentUser(): Usuario | null {
    return this.userSubject.value;
  }

  isLoggedIn(): boolean {
    const exp = Number(localStorage.getItem(EXP_KEY) ?? 0);
    return !!this.token && exp > Date.now();
  }

  isAdmin(): boolean {
    return this.currentUser?.rol?.nombre?.toUpperCase() === 'ADMIN';
  }

  private readUser(): Usuario | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as Usuario) : null;
    } catch {
      return null;
    }
  }
}
