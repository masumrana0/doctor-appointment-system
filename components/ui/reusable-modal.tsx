"use client";
import React, { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

export type ModalType = "success" | "error" | "warning" | "info";

interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: ReactNode;
  type?: ModalType;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  showSecondaryButton?: boolean;
  dangerousHTML?: string;
}

const modalConfig = {
  success: {
    icon: CheckCircle,
    titleColor: "text-green-600",
    iconColor: "text-green-500",
  },
  error: {
    icon: XCircle,
    titleColor: "text-red-600",
    iconColor: "text-red-500",
  },
  warning: {
    icon: AlertCircle,
    titleColor: "text-yellow-600",
    iconColor: "text-yellow-500",
  },
  info: {
    icon: Info,
    titleColor: "text-blue-600",
    iconColor: "text-blue-500",
  },
};

interface ModalState {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  type: ModalType;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  showSecondaryButton?: boolean;
  dangerousHTML?: string;
}

const initialState: ModalState = {
  isOpen: false,
  title: "",
  message: "",
  type: "info",
};

export function ReusableModal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  primaryButtonText = "OK",
  secondaryButtonText = "Cancel",
  onPrimaryAction,
  onSecondaryAction,
  showSecondaryButton = false,
  dangerousHTML,
}: ReusableModalProps) {
  const config = modalConfig[type];
  const Icon = config.icon;

  const handlePrimaryClick = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    } else {
      onClose();
    }
  };

  const handleSecondaryClick = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Icon className={`h-6 w-6 ${config.iconColor}`} />
            <DialogTitle className={config.titleColor}>{title}</DialogTitle>
          </div>
          <DialogDescription className="mt-3 text-left whitespace-pre-wrap">
            {dangerousHTML ? (
              <div dangerouslySetInnerHTML={{ __html: dangerousHTML }} />
            ) : (
              message
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-6">
          {showSecondaryButton && (
            <Button variant="outline" onClick={handleSecondaryClick}>
              {secondaryButtonText}
            </Button>
          )}
          <Button onClick={handlePrimaryClick}>{primaryButtonText}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function useModal() {
  const [modalState, setModalState] = useState<ModalState>(initialState);

  const showModal = (config: Omit<ModalState, "isOpen">) => {
    setModalState({ ...config, isOpen: true });
  };

  const hideModal = () => {
    setModalState(initialState);
  };

  const showSuccess = (
    title: string,
    message: ReactNode,
    primaryButtonText = "OK",
    options?: { dangerousHTML?: string }
  ) => {
    showModal({
      title,
      message,
      type: "success",
      primaryButtonText,
      dangerousHTML: options?.dangerousHTML,
    });
  };

  const showError = (
    title: string,
    message: ReactNode,
    primaryButtonText = "Try Again",
    options?: { dangerousHTML?: string }
  ) => {
    showModal({
      title,
      message,
      type: "error",
      primaryButtonText,
      dangerousHTML: options?.dangerousHTML,
    });
  };

  const showWarning = (
    title: string,
    message: ReactNode,
    primaryButtonText = "OK",
    options?: { dangerousHTML?: string }
  ) => {
    showModal({
      title,
      message,
      type: "warning",
      primaryButtonText,
      dangerousHTML: options?.dangerousHTML,
    });
  };

  const showInfo = (
    title: string,
    message: ReactNode,
    primaryButtonText = "OK",
    options?: { dangerousHTML?: string }
  ) => {
    showModal({
      title,
      message,
      type: "info",
      primaryButtonText,
      dangerousHTML: options?.dangerousHTML,
    });
  };

  const showConfirm = (
    title: string,
    message: ReactNode,
    onConfirm: () => void,
    confirmText = "Confirm",
    cancelText = "Cancel"
  ) => {
    showModal({
      title,
      message,
      type: "warning",
      primaryButtonText: confirmText,
      secondaryButtonText: cancelText,
      onPrimaryAction: onConfirm,
      showSecondaryButton: true,
    });
  };

  return {
    modalState,
    showModal,
    hideModal,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  };
}
