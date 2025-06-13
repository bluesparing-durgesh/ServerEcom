export interface IOrderSetpProps {
  label: string;
  description: string;
  samay?: string;
  _id?: string;
}
export interface IDelivery {
  _id: string;
  orderId: string;
  currentStatus: string;
  deliveredDate?: string;
  orderSteps: IOrderSetpProps[];
  __v: number;
}
export interface IDeliveryRes {
  success: boolean;
  data: IDelivery;
}

export interface IUpdateDeliveryPayload {
  currentStatus: string;
  newStep: IOrderSetpProps;
}

export interface ICancelDeliveryPayload {
  newOrderSteps: IOrderSetpProps[];
}

export interface IApiSuccess{
    success:boolean;
    messag:string
}