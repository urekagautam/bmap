import { Toaster as CToaster } from "react-hot-toast";

export default function Toaster() {
  return (
    <CToaster
      position="top-right"
      containerStyle={{ marginTop: '5rem' }}
      toastOptions={{
        success: {
          duration: 2000,
        },
        error: {
          duration: 2000,
        },
      }}
    />
  );
}
