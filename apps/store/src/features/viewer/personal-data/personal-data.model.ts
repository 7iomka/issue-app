import { createEvent, sample } from 'effector';
import { string } from 'yup';
import { $$viewer } from '@/entities/viewer';
import { $viewer } from '@/entities/viewer/model/viewer.model';
import type { UpdateUserProfileDto, UserProfileDto } from '@/shared/api';
import { getCustomErrorRecord, isCustomAxiosError } from '@/shared/api';
import { createObjectValidator } from '@/shared/form';
import { createForm } from '@/shared/lib/effector-react-form';

// Events
export const personalDatChanged = createEvent<UserProfileDto>();
export const allResetted = createEvent<UserProfileDto>();

const $viewerPersonalData = $$viewer.$viewer.map((viewer) => ({
  firstname: viewer?.firstname ?? '',
  lastname: viewer?.lastname ?? '',
}));

export const personalDataForm = createForm<UpdateUserProfileDto>({
  initialValues: $viewerPersonalData,
  onSubmit: ({ values }) => $$viewer.changePersonalDataFx(values),
  validate: createObjectValidator({
    firstname: string().required(),
    lastname: string().required(),
  }),
});

// Loading status
export const $isPersonalDataFormPending = $$viewer.changePersonalDataFx.pending;
export const $isDataAvailable = $viewer.map((v) => v !== null);

// set values on viewer data change
sample({
  clock: $viewerPersonalData,
  target: personalDataForm.setValues,
});
sample({
  clock: personalDataForm.created,
  source: $viewerPersonalData,
  target: personalDataForm.setValues,
});

// Handle response errors
sample({
  source: $$viewer.changePersonalDataFx.failData,
  filter: isCustomAxiosError,
  fn: getCustomErrorRecord,
  target: personalDataForm.$outerErrorsInline,
});

// On success confirmation
sample({
  clock: $$viewer.changePersonalDataFx.doneData,
  target: personalDatChanged,
});

sample({
  clock: personalDatChanged,
  target: $$viewer.setViewer,
});
