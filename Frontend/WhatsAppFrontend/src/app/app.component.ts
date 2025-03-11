import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router'; // Importando RouterModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,  // Roteamento
    RouterOutlet    // Usando RouterOutlet para renderizar as rotas
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WhatsAppFrontend';
}
