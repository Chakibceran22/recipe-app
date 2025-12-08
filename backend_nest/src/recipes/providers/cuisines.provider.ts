export const CUISINES = 'CUISINES_TOKEN';

export const cuisinesProvider = {
  provide: CUISINES,
  useValue: [
    "Chinese", "Japanese", "Korean", "Indian", "Thai",
    "French", "Italian", "Spanish", "Mexican", "American",
    "Brazilian", "Greek", "Turkish", "Moroccan", "Lebanese",
    "Ethiopian", "Russian", "Vietnamese"
  ],
};
