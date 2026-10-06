import { InfoIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { TeamInvitationContext } from '@/types';

type Props = {
    invitation: TeamInvitationContext;
    action: 'Log in' | 'Register';
};

export default function TeamInvitationAlert({ invitation, action }: Props) {
    return (
        <Alert
            data-test="team-invitation-alert"
            className="border-purple-200 bg-purple-50 text-purple-900 dark:border-purple-900/50 dark:bg-purple-950/50 dark:text-purple-100 [&>svg]:text-purple-600 dark:[&>svg]:text-purple-400"
        >
            <InfoIcon />
            <AlertDescription className="text-purple-900 dark:text-purple-100">
                {action} to join the "{invitation.teamName}" team.
            </AlertDescription>
        </Alert>
    );
}
