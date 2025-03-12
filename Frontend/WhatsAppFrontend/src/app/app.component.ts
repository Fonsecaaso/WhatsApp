import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router'; // Importando RouterModule
import { ChatModule } from './chat/chat.module'; // Importando ChatModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,  // Roteamento
    RouterOutlet,  // Usando RouterOutlet para renderizar as rotas
    ChatModule     // Importando o ChatModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WhatsAppFrontend';
}
