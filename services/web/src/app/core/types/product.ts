import { Category } from "../enums/category.enum";
import { Condition } from "../enums/condition.enum";
import { Material } from "../enums/material.enum";

export interface IProductImage {
  id: number;
  url: string;
  publicId: string;
}

export interface IProduct {
    id: string;
    name: string;
    category: Category;
    description: string;
    condition: Condition;
    material: Material;
    productionDate: string;
    disposalDate: string;
    price: number;
    location: string;
    quantity: string;
    thumbnail: IProductImage;
    images: IProductImage[];
    interestCount: number;
    company_id: string;
}

export type IProductSummary = Pick<IProduct, 'id' | 'name' | 'category' | 'condition' | 'quantity' | 'location' | 'interestCount' | 'thumbnail'>;

export interface IProductPagination {
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface IProductResponse extends IProductPagination {
  content: IProductSummary[];
}

