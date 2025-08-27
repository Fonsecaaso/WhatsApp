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
  
  // Estrutura para armazenar todas as conversas
  private conversations: Map<string, { sender: string; message: string; timestamp: Date }[]> = new Map();
  
  // Contador de mensagens não lidas por usuário
  unreadMessages: Map<string, number> = new Map();

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
    // Salva a conversa atual antes de sair
    if (this.lastRecipient && this.messages.length > 0) {
      this.saveCurrentConversation();
    }
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
        const currentUser = this.authService.getUsername();
        // Filtra a lista para remover o próprio usuário
        this.users = data.filter(user => user !== currentUser);
        console.log('Lista de usuários obtida da API (sem usuário atual):', this.users);
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
          // Salva a mensagem no histórico da conversa correspondente
          this.saveMessageToHistory(data.sender, data.recipient, data.message);
          
          // Só adiciona a mensagem na tela se for da conversa atual
          if (this.lastRecipient && (data.sender === this.lastRecipient || data.recipient === this.lastRecipient)) {
            this.messages.push({ sender: data.sender, message: data.message });
            console.log('Mensagem recebida:', data.message);
          } else {
            // Se não é da conversa atual, incrementa contador de não lidas
            if (data.sender !== this.authService.getUsername()) {
              this.incrementUnreadCount(data.sender);
            }
          }
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
    console.log('Usuário selecionado:', user);
    
    // Salva a conversa atual antes de trocar
    if (this.lastRecipient && this.messages.length > 0) {
      this.saveCurrentConversation();
    }
    
    this.lastRecipient = user;
    
    // Carrega a conversa existente ou cria uma nova
    this.loadConversation(user);
    
    // Zera o contador de mensagens não lidas para este usuário
    this.clearUnreadCount(user);
    
    console.log(`Conversando com: ${this.lastRecipient}`);
  }

  private saveCurrentConversation(): void {
    if (this.lastRecipient) {
      const conversationKey = this.getConversationKey(this.lastRecipient);
      const messagesWithTimestamp = this.messages.map(msg => ({
        ...msg,
        timestamp: new Date()
      }));
      this.conversations.set(conversationKey, messagesWithTimestamp);
      console.log(`Conversa com ${this.lastRecipient} salva. Total de mensagens: ${this.messages.length}`);
    }
  }

  private loadConversation(user: string): void {
    const conversationKey = this.getConversationKey(user);
    const savedConversation = this.conversations.get(conversationKey);
    
    if (savedConversation) {
      // Remove timestamp para exibição (mantém compatibilidade)
      this.messages = savedConversation.map(msg => ({
        sender: msg.sender,
        message: msg.message
      }));
      console.log(`Conversa com ${user} carregada. Total de mensagens: ${this.messages.length}`);
    } else {
      // Nova conversa
      this.messages = [];
      console.log(`Nova conversa iniciada com ${user}`);
    }
  }

  private getConversationKey(user: string): string {
    const currentUser = this.authService.getUsername();
    // Cria uma chave única e consistente para a conversa
    return [currentUser, user].sort().join('-');
  }

  private incrementUnreadCount(user: string): void {
    const currentCount = this.unreadMessages.get(user) || 0;
    this.unreadMessages.set(user, currentCount + 1);
    console.log(`Mensagens não lidas de ${user}: ${currentCount + 1}`);
  }

  private clearUnreadCount(user: string): void {
    this.unreadMessages.set(user, 0);
    console.log(`Mensagens não lidas de ${user} zeradas`);
  }

  getUnreadCount(user: string): number {
    return this.unreadMessages.get(user) || 0;
  }

  private saveMessageToHistory(sender: string, recipient: string, message: string): void {
    const currentUser = this.authService.getUsername();
    let conversationKey: string;
    
    // Determina a chave da conversa baseada no remetente e destinatário
    if (sender === currentUser) {
      conversationKey = this.getConversationKey(recipient);
    } else {
      conversationKey = this.getConversationKey(sender);
    }
    
    // Pega a conversa existente ou cria uma nova
    const conversation = this.conversations.get(conversationKey) || [];
    
    // Adiciona a nova mensagem
    conversation.push({
      sender: sender,
      message: message,
      timestamp: new Date()
    });
    
    // Salva a conversa atualizada
    this.conversations.set(conversationKey, conversation);
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

    if (!this.messageText.trim()) {
      return; // Não envia mensagens vazias
    }
  
    const username = this.authService.getUsername(); // Pegando o usuário logado
    const messageToSend = this.messageText;
  
    const messageData = {
      action: 'chat',
      sender: username,
      recipient: this.lastRecipient,
      message: messageToSend
    };
  
    this.socket.send(JSON.stringify(messageData)); // Envia a mensagem pelo WebSocket
    
    // Adiciona à conversa atual na tela
    this.messages.push({ sender: username, message: messageToSend });
    
    // Salva no histórico de conversas
    this.saveMessageToHistory(username, this.lastRecipient, messageToSend);
    
    this.messageText = ''; // Limpa o campo de mensagem
  }

  // Método para debug - listar todas as conversas salvas
  debugConversations(): void {
    console.log('=== CONVERSAS SALVAS ===');
    this.conversations.forEach((messages, key) => {
      console.log(`Conversa: ${key} - ${messages.length} mensagens`);
      messages.forEach((msg, index) => {
        console.log(`  ${index + 1}. [${msg.timestamp.toLocaleTimeString()}] ${msg.sender}: ${msg.message}`);
      });
    });
    console.log('=== FIM DAS CONVERSAS ===');
  }
  
}
