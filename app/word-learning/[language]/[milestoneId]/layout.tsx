'use client';

import { useParams } from 'next/navigation';

/** Words inherit milestone preload from the milestone page — no second gate here. */
export default function MilestoneUnitLayout({ children }: { children: React.ReactNode }) {
  useParams();
  return <>{children}</>;
}
