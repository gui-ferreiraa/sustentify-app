import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { LucideAngularModule, FileIcon } from 'lucide-angular';
import { FooterComponent } from "./core/components/footer/footer.component";
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    LucideAngularModule,
    FooterComponent
],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  readonly FileIcon = FileIcon;
  title = 'Sustentify';

  constructor(
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.loadCompanyFromToken();
  }
}
