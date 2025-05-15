import { Component, OnInit } from '@angular/core';
import { getEnumOptions } from '../../utils/enum-options';
import { Category } from '../../enums/category.enum';
import { EnumTranslations } from '../../../translations/enum-translations';
import { Material } from '../../enums/material.enum';
import { Condition } from '../../enums/condition.enum';
import { ButtonGreenComponent } from "../button-green/button-green.component";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectInputComponent } from "../inputs/select-input/select-input.component";

interface FiltersForm {
  category: FormControl;
  condition: FormControl;
  material: FormControl;
}

@Component({
  selector: 'app-filter-bar',
  imports: [ButtonGreenComponent, ReactiveFormsModule, SelectInputComponent],
  templateUrl: './filter-bar.component.html',
})
export class FilterBarComponent {
  categoryOptions = getEnumOptions(Category, EnumTranslations.Category);
  materialOptions = getEnumOptions(Material, EnumTranslations.Material);
  conditionOptions = getEnumOptions(Condition, EnumTranslations.Condition);

  form!: FormGroup<FiltersForm>;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = new FormGroup({
      category: new FormControl(''),
      condition: new FormControl(''),
      material: new FormControl(''),
    });
  }

  submitFilters() {
    const value = this.form.value;

    this.router.navigate([], {
      queryParams: {
        category: value.category ?? '',
        material: value.material ?? '',
        condition: value.condition ?? '',
      },
      queryParamsHandling: 'merge'
    })
  }
}
