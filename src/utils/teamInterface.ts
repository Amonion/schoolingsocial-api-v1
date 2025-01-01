export interface IEmail extends Document {
  content: string;
  banner: string;
  title: string;
  name: string;
  note: string;
  createdAt: Date;
}

export interface IPayment extends Document {
  name: string;
  amount: number;
  charge: number;
  logo: string;
  description: string;
  placeId: string;
  country: string;
  countryFlag: string;
  countrySymbol: string;
  currency: string;
  currencySymbol: string;
  createdAt: Date;
}

export interface IPlace extends Document {
  continent: string;
  country: string;
  state: string;
  area: string;
  landmark: string;
  zipCode: string;
  countryCode: string;
  countryFlag: string;
  countrySymbol: string;
  currency: string;
  currencySymbol: string;
  createdAt: Date;
}

export interface IStaff extends Document {
  userId: string;
  areaId: string;
  salary: number;
  level: number;
  username: string;
  picture: string;
  email: string;
  phone: string;
  position: string;
  role: string;
  area: string;
  state: string;
  country: string;
  continent: string;
  isActive: boolean;
  createdAt: Date;
}
