export interface User {
  utmid: string;
  userName: string;
  email: string;
  password?: string;
  role:
    | 'Lecturer'
    | 'Admin'
    | 'Head Of Department'
    | 'Program Coordinator'
    | 'Deputy Dean'
    | 'Dean';
  phoneNumber: string;
}
