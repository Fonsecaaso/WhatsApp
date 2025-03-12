import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { FormsModule } from '@angular/forms';  // Importe o FormsModule aqui

@NgModule({
  declarations: [
    ChatComponent
  ],
  imports: [
    CommonModule,
    FormsModule  // Adicione FormsModule aqui
  ],
  exports: [ChatComponent]
})
export class ChatModule { }
