import {
    Box,
    Button,
    HStack,
    Modal,
    ModalBody,
    ModalContent,
    useToast,
} from '@chakra-ui/react';
import { TwitterShareButton, TelegramShareButton } from 'react-share';
import { FaTwitter, FaTelegram, FaDownload, FaCopy } from 'react-icons/fa';
import { encodeBase64, getGamePnlString } from './utils';
import { GinzaModalHeader } from '../../Modals/GinzaModal';

interface GameData {
    gameId: string;
    username: string;
    blinds: string;
    buyIn: string;
    cashOut: string;
    pnl: string;
}

interface ShareGameModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameData: GameData;
    imageUrl: string | null;
}

export const ShareGameModal: React.FC<ShareGameModalProps> = ({
    isOpen,
    onClose,
    gameData,
    imageUrl,
}: ShareGameModalProps) => {
    const twitterTitle = `${gameData.username} played ${gameData.blinds} No-Limit Texas Hold'em on @ccpgaming_eth and ${getGamePnlString(gameData.pnl)}`;
    const telegramTitle = `${gameData.username} played ${gameData.blinds} No-Limit Texas Hold'em and ${getGamePnlString(gameData.pnl)}`;
    const toast = useToast();
    const handleDownload = () => {
        if (!imageUrl) return;

        const filename =
            encodeBase64(gameData.username + '_' + gameData.gameId) + '.jpeg';
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `${filename}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCopy = async () => {
        if (!imageUrl) return;

        try {
            // Create canvas with smaller dimensions
            const canvas = document.createElement('canvas');
            const img = new Image();
            img.crossOrigin = 'anonymous';

            await new Promise((resolve, reject) => {
                img.onload = () => {
                    const maxWidth = 800;
                    const scale = Math.min(1, maxWidth / img.width);
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;

                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(null);
                };
                img.onerror = reject;
                img.src = imageUrl;
            });

            // Use lower quality for PNG conversion
            canvas.toBlob(async (blob) => {
                if (blob) {
                    try {
                        await navigator.clipboard.write([
                            new ClipboardItem({ 'image/png': blob }),
                        ]);
                        toast({
                            title: 'Image copied',
                            status: 'success',
                            duration: 3000,
                            isClosable: true,
                        });
                    } catch (err) {
                        toast({
                            title: 'Failed to copy image',
                            status: 'error',
                            duration: 3000,
                            isClosable: true,
                        });
                        console.error('Failed to copy image:', err);
                    }
                }
            }, 'image/png');

            canvas.width = 0;
            canvas.height = 0;
        } catch (err) {
            console.error('Failed to copy image:', err);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
            <ModalContent
                w="90vw"
                maxW="350px"
                minH="500px"
                maxH="80vh"
                textColor="rgba(255, 255, 255, 0.875)"
                borderRadius="1rem"
                overflow="hidden"
                boxShadow="0 0 10px rgba(255, 255, 255, 0.5)"
                borderColor="brand.silverGray"
                borderWidth="1.5px"
            >
                <GinzaModalHeader title="Share Game to Socials" />

                <ModalBody>
                    <div className="flex flex-col h-full">
                        <div className="buttons-container">
                            <HStack spacing={4} justify="center" mt="-22px">
                                <TelegramShareButton
                                    title={telegramTitle}
                                    url="about:blank"
                                >
                                    <Button
                                        variant="shareGameButton"
                                        position="relative"
                                    >
                                        <FaTelegram
                                            color="rgba(255, 255, 255, 0.875)"
                                            fontSize="18px"
                                        />
                                    </Button>
                                </TelegramShareButton>

                                <TwitterShareButton
                                    title={twitterTitle}
                                    url="!"
                                >
                                    <Button
                                        variant="shareGameButton"
                                        position="relative"
                                    >
                                        <FaTwitter
                                            color="rgba(255, 255, 255, 0.875)"
                                            fontSize="18px"
                                        />
                                    </Button>
                                </TwitterShareButton>

                                <Button
                                    variant="shareGameButton"
                                    position="relative"
                                    onClick={handleDownload}
                                    cursor={
                                        imageUrl ? 'pointer' : 'not-allowed'
                                    }
                                    opacity={imageUrl ? 1 : 0.5}
                                >
                                    <FaDownload
                                        color="rgba(255, 255, 255, 0.875)"
                                        fontSize="16px"
                                    />
                                </Button>

                                <Button
                                    variant="shareGameButton"
                                    position="relative"
                                    onClick={handleCopy}
                                >
                                    <FaCopy
                                        color="rgba(255, 255, 255, 0.875)"
                                        fontSize="16px"
                                    />
                                </Button>
                            </HStack>
                        </div>

                        {imageUrl && (
                            <Box
                                width="100%"
                                display="flex"
                                justifyContent="center"
                                mt="20px"
                            >
                                <img
                                    src={imageUrl}
                                    alt="Game results"
                                    style={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        borderWidth: '0.25px',
                                        borderStyle: 'solid',
                                        borderColor:
                                            'rgba(255, 255, 255, 0.15)',
                                    }}
                                />
                            </Box>
                        )}
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
