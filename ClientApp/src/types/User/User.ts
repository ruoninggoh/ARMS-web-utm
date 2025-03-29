export interface User {
  UTMID: string;
  name: string;
  email: string;
  password: string;
  role:
    | 'Lecturer'
    | 'Admin'
    | 'Hod'
    | 'Program Coordinator'
    | 'Deputy Dean'
    | 'Dean';
  phoneNo: string;
}
