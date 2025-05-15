import { Toaster as HotToaster } from "react-hot-toast";

export default function Toaster() {
  return (
    <HotToaster
      position="top-right"
      containerStyle={{ marginTop: '5rem' }}
      toastOptions={{
        success: {
          duration: 5000,
          style: {
            background: "var(--success10)",
            color: "var(--success70)",
          },
        },
        error: {
          duration: 5000,
          style: {
            background: "var(--error10)",
            color: "var(--error70)",
          },
        },
      }}
    />
  );
}
