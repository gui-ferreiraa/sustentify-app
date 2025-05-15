import { Component, OnInit } from '@angular/core';
import { ButtonGreenComponent } from "../../../core/components/button-green/button-green.component";
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-terms',
  imports: [ButtonGreenComponent],
  templateUrl: './terms.component.html',
})
export class TermsComponent implements OnInit {

  constructor(
    private readonly titleService: Title,
    private readonly metaService: Meta,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Terms de Uso - Sustentify');
    this.metaService.updateTag({ name: 'description', content: 'Leia os termos e condições de uso da plataforma Sustentify e entenda seus direitos e responsabilidades.' });
    this.metaService.updateTag({ name: 'keywords', content: 'terms, service, Sustentify' });
    this.metaService.updateTag({ name: 'robots', content: 'index, follow' });
    this.metaService.updateTag({ name: 'author', content: 'Sustentify' });
  }

}
