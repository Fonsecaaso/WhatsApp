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
    username: '', // Agora estamos usando 'username' ao invés de 'email'
    password: ''
  };
  errorMessage: string = ''; // Inicializando corretamente

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    // Chamando o AuthService para fazer o login
    console.log('Tentando fazer login com:', this.loginData); // Log para ver os dados sendo enviados
    this.authService.signin(this.loginData).subscribe(
      (response) => {
        console.log('Usuário logado com sucesso:', response);
        // Salve o token ou o que for necessário, se o login for bem-sucedido
        this.router.navigate(['/dashboard']);  // Redireciona após o login bem-sucedido
      },
      (error) => {
        this.errorMessage = 'Credenciais inválidas'; // Definindo a mensagem de erro
        console.error('Erro no login:', error);

        // Log adicional para entender melhor o erro
        if (error.status) {
          console.error('Status do erro:', error.status); // Exibe o status HTTP
        }
        if (error.error) {
          console.error('Resposta do servidor:', error.error); // Exibe o corpo da resposta, se disponível
        }
        if (error.message) {
          console.error('Mensagem de erro:', error.message); // Exibe a mensagem de erro
        }
      }
    );
  }
}
