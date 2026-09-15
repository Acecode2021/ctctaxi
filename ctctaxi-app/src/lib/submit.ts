/** Thin re-export layer: components import contacts, analytics and labels here. */
export { CONTACT, APPS, SOCIAL, track, whatsappLink } from './analytics';
export { validate, validateDriver, submitForm, isPhone, isEmail, CAPTURE } from './forms';
export type { Errors, BookingValues, DriverValues, SubmitResult } from './forms';

/** Booking form service labels — must mirror SERVICE_TYPES in data.ts. */
export const SERVICE_TYPES_LABELS = [
  { value: 'ride', label: 'Ride' },
  { value: 'airport', label: 'Airport Routes' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'delivery', label: 'Delivery' },
] as const;
