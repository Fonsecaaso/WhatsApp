import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'; // Importando o AuthService
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  cadastroData = {
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  };
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService) {} // Injetando o AuthService

  ngOnInit() {
    console.log('Componente Cadastro inicializado');
  }

  onCadastro() {
    console.log('onCadastro chamado');
    console.log('Cadastro Data:', this.cadastroData);

    if (this.cadastroData.password !== this.cadastroData.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem';
      console.log('Erro: As senhas não coincidem');
    } else {
      // Dados a serem enviados no corpo da requisição POST
      const requestBody = {
        email: this.cadastroData.email,
        username: this.cadastroData.username,
        password: this.cadastroData.password
      };

      // Chama o método signup do AuthService
      this.authService.signup(requestBody).subscribe(
        response => {
          // Sucesso na requisição
          console.log('Usuário cadastrado com sucesso:', response);
          this.successMessage = 'Cadastro realizado com sucesso!';
        },
        error => {
          // Erro na requisição
          console.error('Erro ao cadastrar usuário:', error);
          this.errorMessage = 'Erro ao realizar o cadastro. Tente novamente.';
        }
      );
    }
  }
}
