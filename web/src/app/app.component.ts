import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { LucideAngularModule, FileIcon } from 'lucide-angular';
import { FooterComponent } from "./core/components/footer/footer.component";

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
export class AppComponent {
  readonly FileIcon = FileIcon;
  title = 'Sustentify';
}
