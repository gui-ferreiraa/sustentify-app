import { Component, HostListener } from '@angular/core';
import { LucideAngularModule, Menu, X, ChevronDown  } from 'lucide-angular';
import { SustentifyLogoComponent } from "../sustentify-logo/sustentify-logo.component";

@Component({
  selector: 'app-header',
  imports: [LucideAngularModule, SustentifyLogoComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly Menu = Menu;
  private readonly X = X;
  public readonly ChevronDown = ChevronDown;
  public isMenuOpen = false;
  public dropdownOpen = false;
  public scrolled = false;

  constructor() {}

  getMenuIcon() {
    return this.isMenuOpen ? this.X : this.Menu;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;

    this.scrolled = scrollTop > 160;
  }
}
