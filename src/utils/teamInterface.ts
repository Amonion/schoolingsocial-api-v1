export interface IAcademicLevel extends Document {
  country: string;
  countryFlag: string;
  placeId: string;
  level: number;
  maxLevel: number;
  levelName: string;
  certificate: string;
  certificateName: string;
  description: string;
  createdAt: Date;
}

export interface ICourse extends Document {
  schoolId: string;
  facultyId: string;
  level: number;
  semester: number;
  courseCode: string;
  load: number;
  departmentId: number;
  department: string;
  name: string;
  picture: string;
  media: string;
  description: string;
  isChecked?: boolean;
  isActive?: boolean;
}

export interface IDepartment extends Document {
  period: number;
  facultyId: number;
  schoolId: number;
  faculty: string;
  name: string;
  username: string;
  profilePicture: string;
  media: string;
  description: string;
}

export interface IDocument extends Document {
  picture: string;
  name: string;
  description: string;
  country: string;
  countryFlag: string;
  placeId: string;
  createdAt: Date;
}

export interface IEmail extends Document {
  content: string;
  banner: string;
  title: string;
  name: string;
  note: string;
  createdAt: Date;
}

export interface IFaculty extends Document {
  schoolId: string;
  school: string;
  name: string;
  picture: string;
  media: string;
  description: string;
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

export interface ISchool extends Document {
  country: string;
  state: string;
  area: string;
  name: string;
  username: string;
  type: string;
  logo: string;
  media: string;
  picture: string;
  continent: string;
  landmark: string;
  countryFlag: string;
  longitude: number;
  latitude: number;
}

export interface ISchoolPayment extends Document {
  name: string;
  amount: number;
  charge: number;
  schoolLogo: string;
  school: string;
  schoolId: string;
  description: string;
  placeId: string;
  country: string;
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
