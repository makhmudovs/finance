"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogOverlay,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";

interface ModalProps {
  children: React.ReactNode;
  title?: string;
  returnUrl?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Modal({
  children,
  title,
  returnUrl = "/dashboard/transactions",
  open = true,
  onOpenChange,
}: ModalProps) {
  const router = useRouter();

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      router.push(returnUrl);
    }
    onOpenChange?.(isOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogOverlay>
        <AlertDialogContent
          className="max-w-2xl max-h-[90vh] p-0 gap-0"
        >
          <AlertDialogDescription></AlertDialogDescription>
          <AlertDialogHeader className="p-6 border-b flex justify-between items-center">
            <AlertDialogTitle className="text-xl font-semibold">
              {title || "Edit"}
            </AlertDialogTitle>
            <Button
              size="icon"
              onClick={() => handleOpenChange(false)}
              aria-label="Close"
              variant="secondary"
            >
              <X className="w-5 h-5" />
            </Button>
          </AlertDialogHeader>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {children}
          </div>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
