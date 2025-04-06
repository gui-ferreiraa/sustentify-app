import { NgOptimizedImage } from "@angular/common";
import { Component } from "@angular/core";
import { TextColor } from "../../../../../core/types/enums";
import { SubtitleComponent } from "../../../../../core/components/subtitle/subtitle.component";
import { ButtonGreenComponent } from "../../../../../core/components/button-green/button-green.component";

@Component({
  selector: 'app-contact',
  imports: [NgOptimizedImage, SubtitleComponent, ButtonGreenComponent],
  template: `
    <div
      class="relative"
    >
      <img
        [ngSrc]="'/assets/images/background-black.jpg'"
        width="640"
        height="556"
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
          />
          <app-button-green
            title="Contato"
          />
        </div>
      </div>
    </div>
  `
})
export class ContactComponent {
  contact = {
    subtitleColor: TextColor.gray,
    subtitle: 'Não está convencido ?',
    title: 'Fale conosco',
    description: 'Entre em contato para tirar dúvidas, obter suporte ou saber mais sobre como podemos ajudar sua empresa a se tornar mais sustentável.',
  }
}
