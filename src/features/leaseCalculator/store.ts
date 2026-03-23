import { create } from 'zustand';
import { calculateIfrs16 } from './logic';
import { Ifrs16Inputs, Ifrs16Outputs } from './schema';

interface IfrsState {
  result: Ifrs16Outputs | null;
  isCalculating: boolean;
  calculate: (data: Ifrs16Inputs) => Promise<void>;
  reset: () => void;
}

export const useCalcStore = create<IfrsState>((set) => ({
  result: null,
  isCalculating: false,
  calculate: async (data) => {
    set({ isCalculating: true, result: null });
    try {
      const res = await calculateIfrs16(data);
      set({ result: res });
    } catch (error) {
      console.error("IFRS 16 Calculation failed", error);
    } finally {
      set({ isCalculating: false });
    }
  },
  reset: () => set({ result: null, isCalculating: false }),
}));