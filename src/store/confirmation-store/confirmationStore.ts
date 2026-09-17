import { create } from "zustand";
import { ConfirmationState } from "./confirmationStore.types";
import { ModalConfirmationProps } from "@/components/modal-confirmation/ModalConfirmation.types";
import { defaultConfirmation } from "./confirmationStore.constants";

export let resolver: ((confirmed: boolean) => void) | null = null;

const useConfirmationStore = create<ConfirmationState>((set) => ({
  ...defaultConfirmation,

  confirm: (options: Omit<ModalConfirmationProps, "isOpen">) => {
    return new Promise<boolean>((resolve) => {
      resolver = resolve;

      set({ ...defaultConfirmation, ...options, isOpen: true });
    });
  },

  close: (confirmed: boolean) => {
    resolver?.(confirmed);
    resolver = null;
    set({ isOpen: false });
  },
}));

export default useConfirmationStore;
