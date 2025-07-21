import { Button } from '@chakra-ui/react';
import { SignInButton, SignOutButton } from '@clerk/nextjs';

const buttonStyle = {
    variant: 'landingPageButton',
    py: '1rem',
    px: '2rem',
};

export const GinzaSignInButton = () => {
    return (
        <SignInButton mode="modal">
            <Button {...buttonStyle}>Sign In</Button>
        </SignInButton>
    );
};

export const GinzaSignOutButton = () => {
    return (
        <SignOutButton>
            <Button {...buttonStyle}>Sign Out</Button>
        </SignOutButton>
    );
};
