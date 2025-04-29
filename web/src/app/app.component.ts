import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { LucideAngularModule, FileIcon } from 'lucide-angular';
import { FooterComponent } from "./core/components/footer/footer.component";
import { AuthService } from './services/auth/auth.service';
import { IAChatService } from './services/iachat/iachat.service';
import { ChatBoxComponent } from './core/components/chat-box/chat-box.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    ChatBoxComponent,
    LucideAngularModule,
    FooterComponent
],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  readonly FileIcon = FileIcon;
  title = 'Sustentify';
  chatIsWorking = signal(false);

  constructor(
    private readonly authService: AuthService,
    private readonly chat: IAChatService
  ) {}

  ngOnInit(): void {
    this.authService.getCompanyLogged().subscribe();
    this.chat.verify().subscribe(vl => {
      if (vl.successfully) {
        this.chatIsWorking.set(vl.successfully)
      }
    })
  }
}
