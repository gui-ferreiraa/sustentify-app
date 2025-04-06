export interface IProductSummary {
  id: string;
  name: string;
  category: string;
  condition: string;
  quantity: number;
  location: string;
  interestCount: number;
  image: string;
}

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

