import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { getEnumOptions } from '../../utils/enum-options';
import { Category } from '../../enums/category.enum';
import { EnumTranslations } from '../../../translations/enum-translations';
import { Material } from '../../enums/material.enum';
import { Condition } from '../../enums/condition.enum';
import { ButtonGreenComponent } from "../button-green/button-green.component";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectInputComponent } from "../inputs/select-input/select-input.component";

@Component({
  selector: 'app-filter-bar',
  imports: [ButtonGreenComponent, ReactiveFormsModule, SelectInputComponent],
  templateUrl: './filter-bar.component.html',
})
export class FilterBarComponent {
  categoryOptions = getEnumOptions(Category, EnumTranslations.Category);
  materialOptions = getEnumOptions(Material, EnumTranslations.Material);
  conditionOptions = getEnumOptions(Condition, EnumTranslations.Condition);
  form = new FormGroup({
    category: new FormControl(''),
    condition: new FormControl(''),
    material: new FormControl('')
  })

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      category: [''],
      condition: [''],
      material: [''],
    })
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      const material = params['material'];
      const condition = params['condition'];

      this.form.setValue({
        category: category ?? '',
        condition: condition ?? '',
        material: material ?? '',
      })
    })
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
