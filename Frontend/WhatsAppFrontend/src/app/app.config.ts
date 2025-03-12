import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CadastroComponent } from './cadastro/cadastro.component';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component'; // Importando ChatComponent
import { importProvidersFrom } from '@angular/core'; 
import { HttpClientModule } from '@angular/common/http';  // Importando HttpClientModule

// Definindo as rotas
export const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'chat', component: ChatComponent },  // Adicionando a rota para o chat
];

export const appConfig = {
  providers: [
    importProvidersFrom(RouterModule.forRoot(appRoutes)), // Configurando o roteamento
    importProvidersFrom(HttpClientModule), // Adicionando HttpClientModule
  ],
};
