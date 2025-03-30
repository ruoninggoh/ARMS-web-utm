export interface User {
  utmid: string;
  userName: string;
  email: string;
  password?: string;
  role:
    | 'Lecturer'
    | 'Admin'
    | 'Hod'
    | 'Program Coordinator'
    | 'Deputy Dean'
    | 'Dean';
  phoneNumber: string;
}
