import { Component, HostListener, OnInit } from '@angular/core';
import { LucideAngularModule, Menu, X, ChevronDown  } from 'lucide-angular';
import { SustentifyLogoComponent } from "../sustentify-logo/sustentify-logo.component";
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Category } from '../../enums/category.enum';
import { Material } from '../../enums/material.enum';
import { AuthService } from '../../../services/auth/auth.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [LucideAngularModule, SustentifyLogoComponent, CommonModule, RouterModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  private readonly Menu = Menu;
  private readonly X = X;
  protected readonly ChevronDown = ChevronDown;
  protected isMenuOpen = false;
  protected dropdownOpen = false;
  protected scrolled = false;
  protected showBackground = false;
  protected readonly metalSlug = Category.METAL;
  protected readonly plasticSlug = Category.PLASTIC;
  protected isAuthenticated!: Observable<boolean>;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const path = event.urlAfterRedirects;
        this.showBackground = path !== '/';

        this.isMenuOpen = false;
        this.dropdownOpen = false;
      }
    })
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated$;
  }

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
