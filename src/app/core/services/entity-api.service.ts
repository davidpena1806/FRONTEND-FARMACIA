import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Servicio genérico de acceso HTTP, reutilizado por todas las entidades.
 * apiPath es el segmento de ruta, ej: 'productos', 'lotes-producto', 'movimientos-caja'.
 */
@Injectable({ providedIn: 'root' })
export class EntityApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll<T>(apiPath: string, params?: Record<string, any>): Observable<T[]> {
    let httpParams = new HttpParams();
    if (params) {
      for (const key of Object.keys(params)) {
        const value = params[key];
        if (value !== null && value !== undefined && value !== '') {
          httpParams = httpParams.set(key, String(value));
        }
      }
    }
    return this.http.get<T[]>(`${this.baseUrl}/${apiPath}`, { params: httpParams });
  }

  getById<T>(apiPath: string, id: number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${apiPath}/${id}`);
  }

  getSub<T>(apiPath: string, id: number, subResource: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${apiPath}/${id}/${subResource}`);
  }

  create<T>(apiPath: string, payload: Partial<T>): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${apiPath}`, payload);
  }

  postAction<T>(apiPath: string, id: number, action: string, payload?: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${apiPath}/${id}/${action}`, payload ?? {});
  }

  update<T>(apiPath: string, id: number, payload: Partial<T>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${apiPath}/${id}`, payload);
  }

  delete(apiPath: string, id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${apiPath}/${id}`);
  }
}
