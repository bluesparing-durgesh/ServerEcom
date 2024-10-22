export interface IProduct {
  _id?: string;
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  category?: string;
  quantity?: number;
  image?: string;
  shipping?: boolean;
  rating?: number;
}

export interface IaddOrUpdateProductRes {
  success: boolean;
  message: string;
  product: IProduct;
}

export interface IgetProductRes {
  success: boolean;
  products: IProduct[];
  totalProducts?: number;
  totalPages?: number;
  currentPage?: number;
}

export interface DeleteProductRes {
  success: boolean;
  message: string;
}
export interface IUploadExcelRes {
  message: string;
}

export interface IUpdateRatingPayload {
  id: string;
  rating: number;
  review?: string;
}

export interface IUpdateProductRes {
  success: boolean;
}
export interface ISearchSuggestion {
  _id: string;
  name: string;
  category: string;
}
export interface ISearchSuggestionRes {
  data: ISearchSuggestion[];
}
