import { getCurrent } from '@/features/auth/actions'
import MembersList from '@/features/workspaces/components/members-list';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata: Metadata = {
  title: "Trackly  |  Members",
  description: "A project management tool to track your tasks efficiently.",
};

const WorkspaceIdMembersPage = async () => {
    const user = getCurrent();
    if (!user) redirect('/sign-in');

  return (
    <div className='w-full lg:max-w-xl'>
        <MembersList />
    </div>
  )
}

export default WorkspaceIdMembersPage