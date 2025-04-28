import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SubtitleComponent } from '../../../core/components/subtitle/subtitle.component';
import { TextColor } from '../../../core/types/enums';
import { ParagraphSupportComponent } from '../../../core/components/paragraph-support/paragraph-support.component';
import { ButtonGreenComponent } from "../../../core/components/button-green/button-green.component";
import { Display1Component } from "../../../core/components/display1/display1.component";
import { LucideAngularModule, Handshake, SquareUserRound, Trophy, SquareChartGantt, Search, ChartNoAxesCombined } from 'lucide-angular';
import { ProductsService } from '../../../services/product/products.service';
import { Observable } from 'rxjs';
import { IProductSummary } from '../../../core/types/product';
import { ProductCardComponent } from "../../../core/components/product-card/product-card.component";
import { ContactComponent } from "./components/contact/contact.component";
import { TitleDisplayComponent } from "../../../core/components/title-display/title-display.component";
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    NgOptimizedImage,
    LucideAngularModule,
    SubtitleComponent,
    ParagraphSupportComponent,
    ButtonGreenComponent,
    Display1Component,
    ProductCardComponent,
    ProductCardComponent,
    ContactComponent,
    TitleDisplayComponent
],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, AfterViewInit {
  public readonly mainSection = {
    title: 'Transforme o descarte de produtos em ação sustentável',
    image: '/assets/images/main-sustainable.jpg',
    subtitle: 'sustentabilidade e impacto',
    subtitleColor: TextColor.lightGreen,
    paragraph: 'Nossa plataforma oferece soluções para empresas que desejam descartar produtos de forma responsável, reduzindo o impacto ambiental e promovendo práticas ESG. Junte-se a nós e ajude a criar um futuro mais sustentável!',
    paragraphSupportColor: TextColor.white,
  };

  public readonly valuesSection = {
    title: 'Valores',
    subtitle: 'Princípios que Guiam Nossas Ações',
    subtitleColor: TextColor.gray,
    paragraph: 'Na nossa empresa, acreditamos que a tecnologia deve ser uma força para o bem. Estamos comprometidos em criar soluções que não apenas atendam às necessidades dos nossos clientes, mas também contribuam para um futuro mais sustentável e responsável.',
    paragraphSupportColor: TextColor.white,
    displayTitleColor: TextColor.black,
    displayDescriptionColor: TextColor.dark,
    icons: {
      Handshake: Handshake,
      SquareUserRound: SquareUserRound,
      Trophy: Trophy,
    }
  }

  public readonly servicesSection = {
    title: 'Serviços',
    titleColor: TextColor.yellow,
    subtitle: 'Soluções sustentáveis',
    subtitleColor: TextColor.gray,
    paragraph: 'Facilitamos a compra, venda e reaproveitamento de produtos descartados, além de oferecer soluções para compensação de carbono, ajudando sua empresa a ser mais sustentável.',
    paragraphSupportColor: TextColor.white,
    displayTitleColor: TextColor.yellow,
    displayDescriptionColor: TextColor.white,
    icons: {
      SquareChartGantt: SquareChartGantt,
      Search: Search,
      ChartNoAxesCombined: ChartNoAxesCombined,
    }
  }

  public readonly productsSection = {
    title: 'Sustentáveis',
    subtitle: 'Produtos',
    subtitleColor: TextColor.gray,
  }

  products$!: Observable<IProductSummary[]>

  constructor(
    private readonly router: Router,
    private readonly productsService: ProductsService,
    private readonly titleService: Title,
    private readonly metaService: Meta
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Sustentify | Conectando empresas a soluções sustentáveis');
    this.metaService.updateTag({ name: 'description', content: 'Descubra como a Sustentify pode ajudar sua empresa a promover práticas sustentáveis com tecnologia e inovação.' });

    this.productsService.fetchProducts().subscribe();
    this.products$ = this.productsService.products$;
  }

  ngAfterViewInit(): void {
  }

  exploreButtonClicked() {
    this.router.navigate(['/products'])
  }


}
