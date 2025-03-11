import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth'; // URL base da API

  constructor(private http: HttpClient) {}

  // Método para fazer o signup
  signup(data: any): Observable<any> {
    console.log('Chamada para o signup com os dados:', data);  // Log para ver os dados enviados
    return this.http.post(`${this.apiUrl}/signup`, data);
  }
  

  // Método para fazer o signin
  signin(data: any): Observable<any> {
    console.log('Enviando dados para signin:', data);  // Log para verificar os dados
    return this.http.post(`${this.apiUrl}/signin`, data);
  }
}
