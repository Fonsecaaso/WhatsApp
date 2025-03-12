import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service'; // Importar o serviço de cookies

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private usersApiUrl = 'http://localhost:8080/users';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  signup(data: any): Observable<any> {
    console.log('Chamada para o signup com os dados:', data);  // Log para ver os dados enviados
    return this.http.post(`${this.apiUrl}/signup`, data);
  }
  
  signin(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, data);
  }
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setUsername(username: string): void {
    this.cookieService.set('username', username); // Salva o username no cookie
  }

  getUsername(): string {
    return this.cookieService.get('username'); // Obtém o username do cookie
  }

  removeAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    this.cookieService.delete('username'); // Remove o cookie
  }
}
