import React, { Suspense } from 'react'
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { Loader } from 'lucide-react';

import { getCurrent } from '@/features/auth/actions'
import TaskViewSwitcher from '@/features/tasks/components/task-view-switcher';

export const metadata: Metadata = {
  title: "Trackly  |  Tasks"
};

const TasksPage = async () => {
    const user = await getCurrent();
    if (!user) redirect("/sign-in")

  return (
    <div className='h-full flex flex-col'>
        <Suspense fallback={
          <div className="h-full flex items-center justify-center">
            <Loader className="size-6 animate-spin text-muted-foreground" />
          </div>
        }>
          <TaskViewSwitcher />
        </Suspense>
    </div>
  )
}

export default TasksPage