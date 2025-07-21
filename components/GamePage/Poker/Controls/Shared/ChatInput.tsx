import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { useState } from 'react';

import { SendIcon } from './SendIcon';
import { useMutation } from 'convex/react';
import { api } from '../../../../../../../packages/convex/convex/_generated/api';
import { Id } from '../../../../../../../packages/convex/convex/_generated/dataModel';
import useViewer from '../../../../hooks/useViewer';

interface ChatInputProps {
    gameId: Id<'gameData'>;
}

export const ChatInput = (props: ChatInputProps) => {
    const { gameId } = props;
    const { userId } = useViewer();
    const [message, setMessage] = useState<string>('');
    const sendMessageMutation = useMutation(
        api.chat.sendMessage,
    ).withOptimisticUpdate((localStore, args) => {
        const { gameId, message } = args;
        const existingMessages = localStore.getQuery(api.chat.getChat, {
            gameId,
        });
        if (existingMessages !== undefined) {
            const now = Date.now();
            const newMessage = {
                _id: crypto.randomUUID() as Id<'chat'>,
                _creationTime: now,
                gameId,
                message,
                senderId: userId as Id<'users'>,
            };
            localStore.setQuery(api.chat.getChat, { gameId }, [
                ...existingMessages,
                newMessage,
            ]);
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        setMessage('');
        await sendMessageMutation({
            gameId,
            message: message.trim(),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <InputGroup>
                <Input
                    _placeholder={{
                        color: 'brand.white50',
                        fontSize: 'clamp(13px, 0.75rem, 0.75rem)',
                        fontWeight: 'normal',
                        transform: 'translate(2px, -1px)',
                    }}
                    _hover={{}}
                    _focus={{ backgroundColor: 'brand.primaryGray' }}
                    backgroundColor="brand.primaryGray"
                    borderRadius="1.25rem"
                    border="1.5px solid transparent"
                    fontSize="clamp(12px, 1rem, 1rem)"
                    fontWeight="bold"
                    height="2.75rem"
                    placeholder="Enter a message..."
                    size="sm"
                    textColor="white"
                    value={message}
                    variant="filled"
                    onChange={(e) => setMessage(e.currentTarget.value)}
                />
                <InputRightElement
                    height="100%"
                    display="flex"
                    alignItems="center"
                >
                    <SendIcon
                        color={!message.trim() ? 'gray' : 'brand.primaryBlue'}
                        boxSize="1.275rem"
                        cursor={!message.trim() ? 'not-allowed' : 'pointer'}
                        onClick={handleSubmit}
                        type="submit"
                    />
                </InputRightElement>
            </InputGroup>
        </form>
    );
};
