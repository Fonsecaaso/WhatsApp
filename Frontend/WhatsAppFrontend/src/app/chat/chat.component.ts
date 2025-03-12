import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  users: any[] = [];
  messages: { sender: string; message: string }[] = [];
  errorMessage: string = '';
  private socket!: WebSocket;
  messageText: string = '';
  lastRecipient: string | null = null;

  // Altere a visibilidade de private para public
  constructor(
    public http: HttpClient, // De private para public
    public router: Router, // De private para public
    public authService: AuthService // De private para public
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.connectWebSocket();
  }

  ngOnDestroy(): void {
    this.closeWebSocket();
  }

  private loadUsers(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.redirectToLogin();
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get<any[]>('http://localhost:8080/users', { headers }).subscribe({
      next: (data) => {
        this.users = data;
        console.log('Lista de usuários obtida da API:', this.users);
      },
      error: (error) => this.handleError(error)
    });
  }

  private connectWebSocket(): void {
    const token = this.authService.getToken();
    const username = this.authService.getUsername(); // Obtém o username do cookie
  
    if (!token || !username) return;
  
    this.socket = new WebSocket(`ws://localhost:8080/ws?username=${username}`);
  
    this.socket.onopen = () => {
      console.log('Conexão WebSocket estabelecida');
    };
  
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.message) {
          // Adiciona a mensagem com sender e message para ter a mesma estrutura que as mensagens enviadas
          this.messages.push({ sender: data.sender, message: data.message });
          console.log('Mensagem recebida:', data.message);
        }
      } catch (error) {
        console.error('Erro ao processar mensagem WebSocket:', error);
      }
    };
  
    this.socket.onerror = (error) => {
      console.error('Erro na conexão WebSocket:', error);
    };
  
    this.socket.onclose = () => {
      console.log('Conexão WebSocket fechada');
    };
  }
  
  private closeWebSocket(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

  private handleError(error: any): void {
    switch (error.status) {
      case 401:
        this.errorMessage = 'Token inválido. Redirecionando para login...';
        this.redirectToLogin();
        break;
      case 0:
        this.errorMessage = 'Erro de CORS. Verifique as configurações do servidor.';
        break;
      default:
        this.errorMessage = 'Erro ao carregar os usuários';
    }
    console.error('Erro ao buscar usuários:', error);
  }

  private redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

  startConversation(user: any): void {
    console.log('Usuário selecionado:', user); // Verifique a estrutura do objeto user
    this.lastRecipient = user; // Atribui o nome de usuário
    console.log(`Conversando com: ${this.lastRecipient}`);
  }
  

  sendMessage(): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket não está conectado');
      return;
    }
  
    if (!this.lastRecipient) {
      console.error('Nenhum destinatário selecionado');
      return;
    }
  
    const username = this.authService.getUsername(); // Pegando o usuário logado
  
    const messageData = {
      action: 'chat',
      sender: username,
      recipient: this.lastRecipient,
      message: this.messageText
    };
  
    this.socket.send(JSON.stringify(messageData)); // Envia a mensagem pelo WebSocket
    this.messages.push({ sender: username, message: this.messageText }); // Agora isso funciona corretamente
    this.messageText = ''; // Limpa o campo de mensagem
  }
  
}
