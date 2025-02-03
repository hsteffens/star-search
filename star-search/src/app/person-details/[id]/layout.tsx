"use client";

import { withWebvitals } from "utils/withWebvitals";

export default function PersonLayout({ children }: { children: React.ReactNode }) {
    const WrappedChildren = withWebvitals(() => <>{children}</>, 'Person Details');
    return (<WrappedChildren /> );
  }
  