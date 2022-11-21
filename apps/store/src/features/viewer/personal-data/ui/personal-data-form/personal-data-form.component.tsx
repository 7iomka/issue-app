import { Button, Loader } from '@mantine/core';
import { createView } from '@/shared/lib/view';
import { useForm } from '@/shared/lib/effector-react-form';
import { Field, Form } from '@/shared/form';
import {
  $isPersonalDataFormPending,
  personalDataForm,
  $isDataAvailable,
} from '../../personal-data.model';

interface PersonalDataFormProps {
  className?: string;
  formSubmitLabel?: string;
}

const PersonalDataForm = createView<PersonalDataFormProps>()
  .units({
    isLoading: $isPersonalDataFormPending,
    isDataAvailable: $isDataAvailable,
  })
  .map(() => {
    const { controller, handleSubmit } = useForm({
      form: personalDataForm,
      resetUnmount: false,
    });

    return {
      form: personalDataForm,
      controller,
      handleSubmit,
    };
  })
  .view(
    ({
      controller,
      handleSubmit,
      form,
      isLoading,
      className,
      isDataAvailable,
      formSubmitLabel = 'Сохранить данные',
    }) =>
      isDataAvailable ? (
        <div className={className}>
          <Form className={className} onSubmit={handleSubmit}>
            <Field.TextInput
              use={controller({
                name: form.getName('firstname'),
              })}
              label="Имя"
            />

            <Field.TextInput
              use={controller({
                name: form.getName('lastname'),
              })}
              label="Фамилия"
              className="mt-15"
            />

            <Button className="mt-30" fullWidth type="submit">
              {isLoading ? <Loader variant="dots" color="dark" /> : formSubmitLabel}
            </Button>
          </Form>
        </div>
      ) : null,
  );

export type { PersonalDataFormProps };
export { PersonalDataForm };
