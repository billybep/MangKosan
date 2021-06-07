export const newMonth = () => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const d = new Date();
  return monthNames[d.getMonth()];
};

export const numberMonth = () => {
  const d = new Date();
  return d.getMonth();
};

export const dateOnly = (date) => {
  const newDate = date.split('T');
  console.log(newDate);
  return newDate[0];
};

export const month = (date) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return monthNames[date - 1];
};
