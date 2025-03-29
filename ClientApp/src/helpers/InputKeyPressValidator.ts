export const emailCharacter = (event: any) => {
  const validator = /[-`~<>;:"[-\]|{}()=+&#$%^*!?]/g;
  if (validator.test(event.key)) {
    event.preventDefault();
  }
};

export const numericOnly = (event: any) => {
  const numericAllowKeys = ['Backspace', 'Delete', 'Arrow'];
  const validator = /\d/g;

  if (
    validator.test(event.key) ||
    numericAllowKeys.find((x) => event.key.includes(x)) !== undefined ||
    event.ctrlKey
  ) {
    return true;
  } else {
    event.preventDefault();
  }
};

export const alphabetOnly = (event: any) => {
  const validator = /[1234567890`@~<>;:"[-\]|{}(/.,')=_+&#$%^*!?]/g;
  if (validator.test(event.key)) {
    event.preventDefault();
  }
};

export const alphaNumericOnly = (event: any) => {
  const validator = /[-`@~<>;:" [-\]|{}(/.,')=_+&#$%^*!?]/g;
  if (validator.test(event.key)) {
    event.preventDefault();
  }
};
