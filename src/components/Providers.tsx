"use client";

import { usePresenceChannel } from "@/hooks/usePresenceChannel";
import { NextUIProvider } from "@nextui-org/react";
import React, { ReactNode } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }: { children: ReactNode }) {
  usePresenceChannel();

  return (
    <NextUIProvider>
      <ToastContainer position="bottom-right" hideProgressBar />
      {children}
    </NextUIProvider>
  );
}
