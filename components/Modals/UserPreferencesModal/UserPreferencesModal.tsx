import { FormProvider, useForm } from 'react-hook-form';
import { GinzaSurface } from '../GinzaModal';
import { UserPreferences } from './UserPreferences';

interface PreferencesFormData {
    defaultRaiseSize: 'pot' | 'threeFourthsPot' | 'halfPot' | 'minRaise';
    showPotSizedRaise: boolean;
    showThreeFourthsPotRaise: boolean;
    showHalfPotRaise: boolean;
    showMinRaise: boolean;
}

interface UserPreferencesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UserPreferencesModal = ({
    isOpen,
    onClose,
}: UserPreferencesModalProps) => {
    const methods = useForm({
        defaultValues: {
            defaultRaiseSize: 'pot', // 'pot', 'threeFourthsPot', 'halfPot', 'minRaise'
            showPotSizedRaise: true,
            showThreeFourthsPotRaise: true,
            showHalfPotRaise: true,
            showMinRaise: true,
        },
    });

    if (!isOpen) return null;

    return (
        <FormProvider {...methods}>
            <GinzaSurface
                isOpen={isOpen}
                onClose={onClose}
                title="User Preferences"
                content={<UserPreferences />}
            />
        </FormProvider>
    );
};
