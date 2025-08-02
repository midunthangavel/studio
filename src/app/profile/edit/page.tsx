
'use client';

import { PageWrapper } from '@/components/page-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

export default function EditProfilePage() {
  return (
    <PageWrapper
        icon={User}
        title="Edit Profile"
        description="This is where you would edit your profile information."
    >
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>This feature is not yet implemented.</CardDescription>
        </CardHeader>
        <CardContent>
            <p>The ability to edit your profile will be available in a future update. Stay tuned!</p>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
