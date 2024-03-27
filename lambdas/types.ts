import { ISqlType } from "mssql";

interface minTask {
  callSid: string;
  phoneNumber: string;
}

export interface OrderRecyclingBags extends minTask {
  taskName: "OrderRecyclingBag";
  taskParameters: {
    address: {
      house_number: string;
      street_name: string;
      post_code: string;
    }
  }
}

export type Task = OrderRecyclingBags

interface SQLParam {
  type: ISqlType | (() => ISqlType);
  fieldName: string;
  value: string | number | Date;
}
export type SQLParams = SQLParam[]