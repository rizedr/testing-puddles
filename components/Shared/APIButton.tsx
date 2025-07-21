import { Button, ButtonProps, useToast } from '@chakra-ui/react';
import { useState } from 'react';

interface APIButtonProps<TParams, TResponse>
    extends Omit<ButtonProps, 'onClick' | 'isLoading' | 'disabled'> {
    endpoint: (params: TParams) => Promise<TResponse>;
    children: React.ReactNode;
    params?: TParams;
    onSuccess?: (data: TResponse) => void;
    onError?: (error: any) => void;
    disabled?: boolean;
    loadingOverride?: boolean;
}

const APIButton = <TParams, TResponse>({
    endpoint,
    params,
    children,
    onSuccess,
    onError,
    disabled,
    loadingOverride,
    ...props
}: APIButtonProps<TParams, TResponse>) => {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleClick = () => {
        setIsLoading(true);
        endpoint(params || ({} as TParams))
            .finally(() => {
                setIsLoading(false);
            })
            .then((data: TResponse) => {
                onSuccess?.(data);
            })
            .catch((error) => {
                if (onError) {
                    onError(error);
                } else {
                    toast({
                        title: 'Error',
                        description:
                            error.body?.detail || 'An unknown error occurred',
                        status: 'error',
                        duration: 4000,
                    });
                }
            });
    };

    return (
        <Button
            isLoading={loadingOverride ?? isLoading}
            onClick={handleClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </Button>
    );
};

export default APIButton;
