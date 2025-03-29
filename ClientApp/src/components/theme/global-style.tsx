import { createGlobalStyle } from 'styled-components';
import { devices } from './device';
const GlobalStyle = createGlobalStyle`
:root {
  --font-family: 'Roboto';
  --box-shadow: 0px 2px 26px rgba(0, 0, 0, 0.0741095);
  --bg-color: #FFFFFF;
  --bs-primary: #FFBF00 !important;
  --bs-body-font-size: 14px !important;
  --light-yellow: #FFF3DC;
  --bs-link-color: #04AAFF !important;
}

.outline-badge {
  background-color: transparent !important;
  color: #E19824 !important;
  border: 1px solid #E19824 !important;
}

.dropdown-menu {
  --bs-dropdown-link-active-bg: #FFBF00 !important;
}

.btn-primary {
  --bs-btn-bg: #04AAFF !important;
  --bs-btn-border-color: #04AAFF !important;

  --bs-btn-hover-bg: #FFF3DC !important;
  --bs-btn-hover-border-color: #FFF3DC !important;
  --bs-btn-disabled-bg: #FFF3DC !important;
  --bs-btn-active-border-color: #FFF3DC !important;

  --bs-btn-disabled-border-color: #04AAFF !important;
}

span, a {
  text-decoration: none;
  font-weight: 500;
}

* {
  box-sizing: border-box;
  font-family: var(--font-family);
}

.box-container{
  border: none;
  box-shadow: var(--box-shadow);
  background-color: var(--bg-color);
  border-radius: 4px;
}

/* ul, li {
  list-style: none;
  padding: 0;
  margin: 0;
} */

.container ul {
  padding-left: 1em
}

ol > li {
  list-style: inherit;
}

small {
  color: #354F53;
  font-size: 10px;
}

//override for react bootstrap
.form-check-input:checked {
  background-color: var(--bs-primary) !important;
  border-color: var(--bs-primary) !important;
}

.input-bg-success .form-check-input:checked {
  background-color: rgb(var(--bs-success-rgb)) !important;
  border-color: rgb(var(--bs-success-rgb)) !important;
}

.form-check-input:focus {
  box-shadow: unset !important;
}
.card-title {
  font-weight: 700 !important;
  font-size: 20px !important;
}

.btn-xs {
  padding: .25rem .5rem !important;
  font-size: 10px !important
}

.btn-check+.btn {
  border: 1px solid #B1B1B1 !important;
  border-radius: 8px;
}

.btn-check:checked+.btn {
  background: var(--bs-primary) !important;
  color: #333 !important;
  border: 1px solid var(--bs-primary) !important;
  border-radius: 8px;
  font-weight: 700;
}

.accordion {
  --bs-accordion-btn-color: inherit !important;
  --bs-accordion-btn-bg: inherit !important;
  --bs-accordion-active-color: inherit !important;
  --bs-accordion-active-bg: inherit !important;
}

.shadow-none .accordion-button {
  box-shadow: none !important;
}

.accordion-button::after {
  background-image: var(--bs-accordion-btn-icon) !important;
}

.text-white .accordion-button::after {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23f8f9fa'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e") !important;
}

.bg-etiqa-primary {
  background-color: var(--bs-primary) !important;
}

.border-etiqa-primary.border,
.border-etiqa-primary.border-top,
.border-etiqa-primary.border-bottom,
.border-etiqa-primary.border-start,
.border-etiqa-primary.border-end {
  border-color: var(--bs-primary) !important;
}

// Custom styles.
.bg-lightyellow {
  background-color: var(--light-yellow) !important;
}

.pre-line {
  white-space: pre-line;
}

.card {
  border: 0px !important;
}

.a-link {
  font-family: 'Lato';
  font-weight: 600;
  color:#025D8F !important;
  text-decoration: underline;
}

.a-link-none-line {
  font-family: 'Lato';
  font-weight: 600;
  color:#025D8F !important;
  text-decoration: none;
  cursor:pointer;
}

.accordion-button:focus {
  box-shadow: none !important;
}

.rdp {
  --rdp-accent-color: #FFBF00 !important;
}

@media screen and ${devices.xs} {
  :root{
    font-size: 14px;
  }
  
}
@media screen and ${devices.lg} {
  :root{
    font-size: 16px;
  }
}

.cursor-pointer {
  cursor: pointer;
}

.max-w-600px {
  max-width: 600px;
}

.personal-detail-form .form-switch .form-check-input:checked {
  background-color: #ffbf00;
}

.personal-detail-form .personal-detail-form-mailing-address {
  margin-top: 50px;
}

.personal-detail-form .btn-submit {
  background: #ffbf00;
  border-radius: 6px;
  width: 200px;
  height: 50px;
  float: right;
}

.btn-yellow {
  background: #ffbf00;
  border-radius: 6px;
  padding: 10px 30px;
}

.btn-white {
  background: #f5f5f5;
  border-radius: 6px;
  border: 1px solid #707070;
  padding: 10px 30px;
}
`;

export default GlobalStyle;
