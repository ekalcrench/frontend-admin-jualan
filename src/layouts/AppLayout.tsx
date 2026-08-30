import { Fragment } from "react/jsx-runtime";
import { Toaster } from "sonner";

export default function AppLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <Fragment>
      <Toaster />
      {children}
    </Fragment>
  );
}
