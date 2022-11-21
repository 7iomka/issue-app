// eslint-disable-next-line import/first
import { addMethod, StringSchema } from 'yup';
// /^(\+7|7|8)?[\s-]?\(?[489][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;
const phoneRegex = /^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{7,10}$/;

// Russian numbers ()
addMethod(StringSchema, 'phoneRu', function format(args) {
  return this.matches(phoneRegex, {
    message: 'Введите корректный номер телефона',
  });
});
