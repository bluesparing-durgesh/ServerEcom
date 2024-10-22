export interface ICategoryPayload {
  name: string;
 
}
export interface IAddCategoryRes {
  success: boolean;
  message: string;
  category: ICategory;
}
export interface ICategory {
  name: string;
  slug?: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IgetCategoryRes {
  success: boolean;
  message: string;
  categories: ICategory[];
}
export interface IdeleteRes {
  success: boolean;
  message: string;
}

export interface IGetCateByIdRes{
  success: boolean;
  data:ICategory
}