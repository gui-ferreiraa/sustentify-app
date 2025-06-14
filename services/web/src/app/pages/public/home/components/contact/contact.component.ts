import { NgOptimizedImage } from "@angular/common";
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { TextColor } from "../../../../../core/types/enums";
import { SubtitleComponent } from "../../../../../core/components/subtitle/subtitle.component";
import { ButtonGreenComponent } from "../../../../../core/components/button-green/button-green.component";
import { Router } from "@angular/router";

@Component({
  selector: 'app-contact',
  imports: [NgOptimizedImage, SubtitleComponent, ButtonGreenComponent],
  template: `
    <div
      class="relative -z-40"
      #appContact
    >
      <img
        ngSrc="/sustentify/public/background-black_1_dharvv.jpg"
        width="640"
        height="426"
        class="w-full rounded-xl object-cover relative top-0 left-0 brightness-75 h-96 min-[320px]:h-80 sm:h-72"
      />

      <div class="absolute w-full top-12 flex flex-col items-center justify-center gap-4">
        <app-subtitle
          [title]="contact.subtitle"
          [color]="contact.subtitleColor"
        />
        <h2 class="text-xl md:text-2xl lg:text-3xl font-semibold text-[#FFF952]">
          {{ contact.title }}
        </h2>
        <p
          class="default-paragraph text-white w-[60%] text-center"
        >
          {{ contact.description }}
        </p>
        <div class="flex flex-col gap-3 w-full sm:flex-row sm:gap-6 justify-center items-center">
          <app-button-green
            title="Explore"
            (click)="onClickExploreButton()"
            [disabled]="false"
            [type]="'button'"
          />
          <app-button-green
            title="Contato"
            (click)="onClickContactButton()"
            [disabled]="false"
            [type]="'button'"
          />
        </div>
      </div>
    </div>
  `
})
export class ContactComponent implements AfterViewInit{
  contact = {
    subtitleColor: TextColor.gray,
    subtitle: 'Não está convencido ?',
    title: 'Fale conosco',
    description: 'Entre em contato para tirar dúvidas, obter suporte ou saber mais sobre como podemos ajudar sua empresa a se tornar mais sustentável.',
  }

  constructor(
    private readonly router: Router,
  ) {}

  ngAfterViewInit(): void {
  }

  onClickExploreButton() {
    this.router.navigate(['/products']);
  }

  onClickContactButton() {
    this.router.navigate(['/contact'])
  }
}
