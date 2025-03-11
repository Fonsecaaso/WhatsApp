import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
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
      console.log('Usuário cadastrado:', this.cadastroData);
    }
  }
  
}
