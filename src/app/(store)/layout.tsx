// React
import { ReactNode } from "react";

// Components
import Header from "@/components/store/layout/header/header";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      <div>{children}</div>
      {/* Footer */}
    </div>
  );
}
