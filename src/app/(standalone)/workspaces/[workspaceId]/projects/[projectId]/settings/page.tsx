import { getCurrent } from '@/features/auth/actions'
import { getProject } from '@/features/projects/actions';
import { EditProjectForm } from '@/features/projects/components/edit-project-form';
import { redirect } from 'next/navigation';
import React from 'react';

interface ProjectIdSettingsPageProps {
    params: {  
        workspaceId: string;
        projectId: string;
    }
}

const ProjectIdSettingsPage = async ({ params }: ProjectIdSettingsPageProps) => {
    const user = await getCurrent();
    if(!user) redirect('/sign-in');

    const project = await getProject({ projectId: params.projectId });

  return (
    <div className="w-full lg:max-w-4xl">
        <EditProjectForm initialValues={project!} />
    </div>
  )
}

export default ProjectIdSettingsPage