import { attach, createEvent, createStore, restore, sample } from 'effector';
import { debug } from 'patronum/debug';
import type { UserProfileDto } from '@/shared/api';
import { api } from '@/shared/api'; 
// Account namespace
export * as account from './viewer-account.model';

// Effects
export const getPersonalDataFx = attach({
  effect: api.user.getUserProfile,
});

export const changePersonalDataFx = attach({
  effect: api.user.changeUserPersonalData,
});

export const logoutFx = attach({
  effect: api.auth.logout,
});

export const getProductCountersFx = attach({
  effect: api.product.getUserProductCounters,
});

// Events
export const setViewer = createEvent<UserProfileDto | null | boolean>();
export const logoutTriggered = createEvent();
export const compareListChanged = createEvent<ID[]>(); // TODO: extract from here

// Default states
export const $viewer = restore(setViewer, null);
export const $isLogoutPending = logoutFx.pending;
export const $isAuthorized = $viewer.map(Boolean);
export const $compareList = createStore<ID[]>([]); // TODO: extract from here

// State<->event relations

// handle get / change personal data
sample({
  clock: [getPersonalDataFx.doneData, changePersonalDataFx.doneData],
  target: setViewer,
});
sample({
  clock: getPersonalDataFx.failData,
  source: $viewer,
  fn: (v) => (v === false ? null : false),
  target: setViewer,
});

debug({ $viewer, $isAuthorized, logoutTriggered });

// // TODO: handle get from local storage for unauthorized viewer
// $favorites
//   .on($viewer, (_, viewer) => (viewer ? viewer.favorites : []))
//   .on(favoritesChanged, (_, updatedFavorites) => updatedFavorites);

// $compareList
//   .on($viewer, (_, viewer) => (viewer ? viewer.compareList : []))
//   .on(compareListChanged, (_, updatedCompareList) => updatedCompareList);
