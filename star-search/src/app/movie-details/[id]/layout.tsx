"use client";

import { withWebvitals } from "utils/withWebvitals";

export default function MovieLayout({ children }: { children: React.ReactNode }) {
    const WrappedChildren = withWebvitals(() => <>{children}</>, 'Movie Details');
    return (<WrappedChildren /> );
  }
  