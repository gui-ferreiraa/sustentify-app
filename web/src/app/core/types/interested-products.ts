import { InterestStatus } from "../enums/InterestStatus";
import { ICompanySummary } from "./company";
import { IProductSummary } from "./product";

export interface IInterestedProductSummary {
  id: number;
  productId: number;
  message: string;
  status: InterestStatus;
  quantity: number;
  buyerId: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface IInterestedProduct extends Omit<IInterestedProductSummary, 'productId' | 'buyerId'> {
  product: IProductSummary;
  buyer: ICompanySummary;
}
