import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/actions';
import WorkspaceIdClient from './client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Trackly  |  Home"
};

const WorkspaceIdPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return (
    <div>
      <WorkspaceIdClient />
    </div>
  )
}

export default WorkspaceIdPage
