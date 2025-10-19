import { create } from "zustand";
import { Field } from "@/lib/types";
import { getFieldsByUser } from "@/actions";

interface FieldsState {
  fields: Field[];
  isLoading: boolean;
  tempFields: Field[];

  // Actions
  setFields: (fields: Field[]) => void;
  setTempFields: (tempFields: Field[]) => void;
  setIsLoading: (loading: boolean) => void;
  fetchFields: () => Promise<void>;
  addField: (field: Field) => void;
  updateField: (id: string, field: Partial<Field>) => void;
  removeField: (id: string) => void;
  clearTempFields: () => void;
}

export const useFieldsStore = create<FieldsState>((set) => ({
  // Initial state
  fields: [],
  isLoading: true,
  tempFields: [],

  // Actions
  setFields: (fields: Field[]) => set({ fields }),

  setTempFields: (tempFields: Field[]) => set({ tempFields }),

  setIsLoading: (isLoading: boolean) => set({ isLoading }),

  fetchFields: async () => {
    set({ isLoading: true });
    try {
      const fetchedFields = await getFieldsByUser();
      set({ fields: fetchedFields ?? [], isLoading: false });
    } catch (error) {
      console.error("Error fetching fields:", error);
      set({ isLoading: false });
    }
  },

  addField: (field: Field) => {
    set((state) => ({ fields: [...state.fields, field] }));
  },

  updateField: (id: string, fieldData: Partial<Field>) => {
    set((state) => ({
      fields: state.fields.map((field) =>
        field.id === id ? { ...field, ...fieldData } : field
      ),
    }));
  },

  removeField: (id: string) => {
    set((state) => ({
      fields: state.fields.filter((field) => field.id !== id),
    }));
  },

  clearTempFields: () => set({ tempFields: [] }),
}));
