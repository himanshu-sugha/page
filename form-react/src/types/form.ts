export interface FormData {
  fname: string;
  lname: string;
  appAddress: string;
  email: string;
  phone: string;
  bdate: string;
  gender: string;
}

export type FormField = keyof FormData;