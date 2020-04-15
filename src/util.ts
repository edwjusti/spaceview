export const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
export const numberFormatter = new Intl.NumberFormat('en-US');

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
