import { create } from "zustand";

interface LoadingState {
  // Global loading states
  isAppLoading: boolean;
  isUserLoading: boolean;
  isFieldsLoading: boolean;
  isJobsLoading: boolean;
  isWeatherLoading: boolean;
  isMapLoading: boolean;

  // Action loading states
  isSavingField: boolean;
  isCreatingJob: boolean;
  isUpdatingJob: boolean;
  isDeletingJob: boolean;
  isGettingDirections: boolean;

  // Loading messages
  loadingMessage: string;

  // Actions
  setAppLoading: (loading: boolean, message?: string) => void;
  setUserLoading: (loading: boolean) => void;
  setFieldsLoading: (loading: boolean) => void;
  setJobsLoading: (loading: boolean) => void;
  setWeatherLoading: (loading: boolean) => void;
  setMapLoading: (loading: boolean) => void;
  setSavingField: (loading: boolean) => void;
  setCreatingJob: (loading: boolean) => void;
  setUpdatingJob: (loading: boolean) => void;
  setDeletingJob: (loading: boolean) => void;
  setGettingDirections: (loading: boolean) => void;
  setLoadingMessage: (message: string) => void;
  resetAllLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  // Initial states
  isAppLoading: false,
  isUserLoading: false,
  isFieldsLoading: false,
  isJobsLoading: false,
  isWeatherLoading: false,
  isMapLoading: false,
  isSavingField: false,
  isCreatingJob: false,
  isUpdatingJob: false,
  isDeletingJob: false,
  isGettingDirections: false,
  loadingMessage: "Loading...",

  // Actions
  setAppLoading: (loading: boolean, message?: string) =>
    set({
      isAppLoading: loading,
      loadingMessage: message || "Loading...",
    }),

  setUserLoading: (loading: boolean) => set({ isUserLoading: loading }),
  setFieldsLoading: (loading: boolean) => set({ isFieldsLoading: loading }),
  setJobsLoading: (loading: boolean) => set({ isJobsLoading: loading }),
  setWeatherLoading: (loading: boolean) => set({ isWeatherLoading: loading }),
  setMapLoading: (loading: boolean) => set({ isMapLoading: loading }),
  setSavingField: (loading: boolean) => set({ isSavingField: loading }),
  setCreatingJob: (loading: boolean) => set({ isCreatingJob: loading }),
  setUpdatingJob: (loading: boolean) => set({ isUpdatingJob: loading }),
  setDeletingJob: (loading: boolean) => set({ isDeletingJob: loading }),
  setGettingDirections: (loading: boolean) =>
    set({ isGettingDirections: loading }),
  setLoadingMessage: (message: string) => set({ loadingMessage: message }),

  resetAllLoading: () =>
    set({
      isAppLoading: false,
      isUserLoading: false,
      isFieldsLoading: false,
      isJobsLoading: false,
      isWeatherLoading: false,
      isMapLoading: false,
      isSavingField: false,
      isCreatingJob: false,
      isUpdatingJob: false,
      isDeletingJob: false,
      isGettingDirections: false,
      loadingMessage: "Loading...",
    }),
}));
