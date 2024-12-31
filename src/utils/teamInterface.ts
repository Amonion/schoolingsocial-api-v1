export interface IPlace extends Document {
  continent: string;
  country: string;
  state: string;
  area: string;
  landmark: string;
  zipCode: string;
  countryCode: string;
  countryFlag: string;
  createdAt: Date;
}
