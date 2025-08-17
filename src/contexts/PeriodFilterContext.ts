import { createContext } from 'react';

export const PeriodFilterContext = createContext<{
  appliedRange: { from?: Date; to?: Date };
  setAppliedRange: (range: { from?: Date; to?: Date }) => void;
}>({
  appliedRange: {},
  setAppliedRange: () => {},
});
