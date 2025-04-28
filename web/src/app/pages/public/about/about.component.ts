import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TitleDisplayComponent } from "../../../core/components/title-display/title-display.component";
import { TextColor } from '../../../core/types/enums';
import { NgOptimizedImage } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  imports: [NgOptimizedImage, TitleDisplayComponent],
  templateUrl: './about.component.html',
})
export class AboutComponent implements OnInit, AfterViewInit {
  about = {
    title: 'Transformando Descartes em Oportunidades Sustentáveis',
    titleColor: TextColor.black,
    subtitle: 'sobre',
    subtitleColor: TextColor.gray,
  }

  @ViewChild('titleDisplay', { read: ElementRef }) titleDisplayRef!: ElementRef<HTMLDivElement>;

  constructor(
    private readonly titleService: Title,
    private readonly metaService: Meta
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Sobre Nós | Sustentify');
    this.metaService.updateTag({ name: 'description', content: 'Conheça a missão, visão e valores da Sustentify. Juntos por um futuro mais verde e consciente.' });
  }

  ngAfterViewInit(): void {
  }
}
