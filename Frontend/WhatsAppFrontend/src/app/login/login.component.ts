import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Adicionando ReactiveFormsModule
import { CommonModule } from '@angular/common'; // Importando CommonModule
import { AuthService } from '../auth.service'; // Importando o AuthService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule, // Adicionando FormsModule aos imports
    ReactiveFormsModule, // Adicionando ReactiveFormsModule
    CommonModule // Adicionando CommonModule para permitir *ngIf
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    username: '', 
    password: ''
  };
  errorMessage: string = ''; // Inicializando corretamente

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    this.authService.signin(this.loginData).subscribe(
      (response) => {
        if (response && response.token) {
          this.authService.setToken(response.token); 
          this.authService.setUsername(this.loginData.username); // Salva o username no cookie
          this.router.navigate(['/chat']);
        } else {
          this.errorMessage = 'Token não recebido do servidor';
        }
      },
      (error) => {
        this.errorMessage = 'Credenciais inválidas';
        console.error('Erro no login:', error);
      }
    );
  }
  
}
