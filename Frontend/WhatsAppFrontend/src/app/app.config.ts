import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CadastroComponent } from './cadastro/cadastro.component';
import { LoginComponent } from './login/login.component';
import { importProvidersFrom } from '@angular/core'; 
import { HttpClientModule } from '@angular/common/http';  // Importando HttpClientModule

// Definindo as rotas
export const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'login', component: LoginComponent },
];

export const appConfig = {
  providers: [
    importProvidersFrom(RouterModule.forRoot(appRoutes)), // Configurando o roteamento
    importProvidersFrom(HttpClientModule), // Adicionando HttpClientModule
  ],
};
