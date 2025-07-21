import {
    Button,
    HStack,
    Text,
    VStack,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Tooltip,
    Checkbox,
    ButtonGroup,
    SliderMark,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
} from '@chakra-ui/react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { FaCog, FaBomb, FaCoins, FaBitcoin, FaPlus } from 'react-icons/fa';
import {
    CreateTableFormValues,
    NO_MAX_MAXIMUM,
    SHOWDOWN_OPTIONS,
    EXTRA_TIMER_OPTIONS,
    STAKE_LEVELS,
    STAKE_SETTINGS,
} from './schema';

export const GameOptions = () => {
    const { control, setValue, watch } = useFormContext<CreateTableFormValues>();

    const stakeLevel = useWatch({
        control,
        name: 'stakeLevel',
    });
    const blindIndex = useWatch({
        control,
        name: 'blindIndex',
    });
    const noMaxBuyIn = useWatch({
        control,
        name: 'noMaxBuyIn',
    });
    const bombPotBB = useWatch({
        control,
        name: 'bombPotBB',
    });
    const bombPotFrequency = useWatch({
        control,
        name: 'bombPotFrequency',
    });
    const extraTime = useWatch({
        control,
        name: 'extraTime',
    });
    const ante = useWatch({
        control,
        name: 'ante',
    });

    const currentBlinds = STAKE_SETTINGS[stakeLevel][blindIndex];
    const maxBlindsIndex = STAKE_SETTINGS[stakeLevel].length - 1;

    // Check if only one bomb pot field is filled
    const showBBError = bombPotBB === 0 && bombPotFrequency > 0;
    const showFreqError = bombPotBB > 0 && bombPotFrequency === 0;

    return (
        <VStack alignItems="start" spacing="1.5rem">
            <VStack spacing="1rem" w="100%" alignItems="start">
                <HStack spacing="0.5rem" alignItems="center">
                    <FaBitcoin color="#9F7AEA" size="18px" />
                    <Text variant="modalH1">Blinds</Text>
                    <Text fontSize="1rem" fontWeight="bold" color="purple.400">{`${currentBlinds.sb}/${currentBlinds.bb}`}</Text>
                </HStack>
                <Controller
                    name="stakeLevel"
                    control={control}
                    render={({ field: { value, onChange } }) => {
                        return (
                            <HStack spacing="1rem">
                                {STAKE_LEVELS.map(
                                    ({ label, value: optionValue }) => {
                                        const isActive = value === optionValue;
                                        return (
                                            <Button
                                                fontSize="0.875rem"
                                                key={optionValue}
                                                variant="gameOptionButton"
                                                onClick={() => {
                                                    onChange(optionValue);
                                                }}
                                                isActive={isActive}
                                            >
                                                {label}
                                            </Button>
                                        );
                                    },
                                )}
                            </HStack>
                        );
                    }}
                />
                <Controller
                    name="blindIndex"
                    control={control}
                    render={({ field }) => (
                        <HStack w="100%" spacing="1.5rem">
                            <Text variant="sliderText" fontSize="0.75rem">
                                {`${STAKE_SETTINGS[stakeLevel][0].sb}/${STAKE_SETTINGS[stakeLevel][0].bb}`}
                            </Text>
                            <Slider
                                w="90%"
                                minWidth="18rem"
                                maxWidth="65%"
                                min={0}
                                max={maxBlindsIndex}
                                step={1}
                                value={field.value}
                                onChange={field.onChange}
                            >
                                <SliderTrack bg="gray.600">
                                    <SliderFilledTrack bg="purple.700" />
                                </SliderTrack>
                                <Tooltip
                                    hasArrow
                                    bg="brand.gray20"
                                    color="white"
                                    placement="bottom"
                                    label={`${currentBlinds.sb}/${currentBlinds.bb}`}
                                >
                                    <SliderThumb bg="purple.700" />
                                </Tooltip>
                            </Slider>
                            <Text variant="sliderText" fontSize="0.75rem">
                                {`${STAKE_SETTINGS[stakeLevel][maxBlindsIndex].sb}/${STAKE_SETTINGS[stakeLevel][maxBlindsIndex].bb}`}
                            </Text>
                        </HStack>
                    )}
                />
            </VStack>

            <VStack spacing="1rem" w="100%" alignItems="start">
                <HStack spacing="1rem" alignItems="center">
                    <FaCoins color="#9F7AEA" size="18px" />
                    <Text variant="modalH1">Buy-in (Min/Max)</Text>
                    <Controller
                        name="noMaxBuyIn"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <Checkbox
                                isChecked={value}
                                onChange={(e) => {
                                    onChange(e.target.checked);
                                    if (e.target.checked) {
                                        setValue('maxBuyIn', NO_MAX_MAXIMUM);
                                    } else {
                                        const minBuyIn = watch('minBuyIn');
                                        const currentMax = watch('maxBuyIn') ?? 500;
                                        setValue('maxBuyIn', Math.max(minBuyIn, Math.min(currentMax, 500)));
                                    }
                                }}
                                borderColor="brand.gray20"
                                colorScheme="brand.purple.500"
                                iconColor="brand.purple.500"
                                _checked={{
                                    borderColor: 'brand.purple.500',
                                }}
                            >
                                <Text color="white">No Max</Text>
                            </Checkbox>
                        )}
                    />
                </HStack>
                <Controller
                    name="minBuyIn"
                    control={control}
                    render={({ field: minField }) => (
                        <Controller
                            name="maxBuyIn"
                            control={control}
                            render={({ field: maxField }) => (
                                <>
                                    <HStack spacing="2.5rem" pb="0.5rem">
                                        <HStack spacing="0.5rem">
                                            <Text fontSize="0.95rem" color="gray.300">Min:</Text>
                                            <Text fontSize="1rem" fontWeight="bold" color="purple.400">{minField.value} BB</Text>
                                        </HStack>
                                        <HStack spacing="0.5rem">
                                            <Text fontSize="0.95rem" color="gray.300">Max:</Text>
                                            <Text fontWeight="bold" color="purple.400" fontSize={noMaxBuyIn ? '1.25rem' : '1rem'}>
                                                {noMaxBuyIn ? '∞' : `${maxField.value} BB`}
                                            </Text>
                                        </HStack>
                                    </HStack>
                                    <HStack w="100%" spacing="1.5rem">
                                        <Text variant="sliderText">10 BB</Text>
                                        {!noMaxBuyIn ? (
                                            <RangeSlider
                                                w="90%"
                                                minWidth="18rem"
                                                maxWidth="67.5%"
                                                min={10}
                                                max={500}
                                                step={5}
                                                value={[minField.value, maxField.value]}
                                                onChange={([min, max]) => {
                                                    minField.onChange(min);
                                                    maxField.onChange(max);
                                                }}
                                            >
                                                <RangeSliderTrack bg="gray.600">
                                                    <RangeSliderFilledTrack bg="purple.700" />
                                                </RangeSliderTrack>
                                                <Tooltip hasArrow bg="brand.gray20" color="white" placement="bottom" label={`${minField.value} BB`}>
                                                    <RangeSliderThumb index={0} bg="purple.700" />
                                                </Tooltip>
                                                <Tooltip hasArrow bg="brand.gray20" color="white" placement="bottom" label={`${maxField.value} BB`}>
                                                    <RangeSliderThumb index={1} bg="purple.700" />
                                                </Tooltip>
                                            </RangeSlider>
                                        ) : (
                                            <Slider
                                                w="90%"
                                                minWidth="18rem"
                                                maxWidth="67.5%"
                                                min={10}
                                                max={500}
                                                step={5}
                                                value={minField.value}
                                                onChange={minField.onChange}
                                            >
                                                <SliderTrack bg="gray.600">
                                                    <SliderFilledTrack bg="purple.700" />
                                                </SliderTrack>
                                                <Tooltip hasArrow bg="brand.gray20" color="white" placement="bottom" label={`${minField.value} BB`}>
                                                    <SliderThumb bg="purple.700" />
                                                </Tooltip>
                                            </Slider>
                                        )}
                                        <Text variant="sliderText" fontWeight={noMaxBuyIn ? 'bold' : undefined} fontSize={noMaxBuyIn ? '1.25rem' : undefined}>
                                            {noMaxBuyIn ? '∞' : '500 BB'}
                                        </Text>
                                    </HStack>
                                </>
                            )}
                        />
                    )}
                />
            </VStack>

            <VStack spacing="1rem" paddingBottom="1.25rem" w="100%" alignItems="start">
                <HStack spacing="0.5rem" alignItems="center">
                    <FaCog color="#9F7AEA" size="18px" />
                    <Text variant="modalH1">Game Settings</Text>
                </HStack>
                <Controller
                    name="turnTime"
                    control={control}
                    render={({ field }) => (
                        <VStack alignItems="start" spacing="0.75rem" pb="2rem">
                            <HStack spacing="1rem" alignItems="center">
                                <Text variant="modalH2">Turn time</Text>
                                <Text fontSize="1rem" fontWeight="bold" color="purple.400">
                                    {field.value}s
                                </Text>
                            </HStack>
                            <HStack w="100%" spacing="1.5rem">
                                <Slider
                                    w="100%"
                                    ml="0.5rem"
                                    minWidth="20rem"
                                    maxWidth="100%"
                                    min={15}
                                    max={45}
                                    step={5}
                                    value={field.value}
                                    onChange={field.onChange}
                                >
                                    <SliderTrack bg="gray.600">
                                        <SliderFilledTrack bg="purple.700" />
                                    </SliderTrack>
                                    {[15, 20, 25, 30, 35, 40, 45].map((value) => (
                                        <SliderMark
                                            key={value}
                                            value={value}
                                            mt="4"
                                            ml="-0.5rem"
                                            fontSize="0.75rem"
                                            color={field.value === value ? 'brand.textWhite' : 'gray.400'}
                                            fontWeight={field.value === value ? 'bold' : 'normal'}
                                        >
                                            {value}s
                                        </SliderMark>
                                    ))}
                                    <Tooltip
                                        hasArrow
                                        bg="brand.gray20"
                                        color="white"
                                        placement="bottom"
                                        // label={`${field.value}s`}
                                    >
                                        <SliderThumb 
                                            bg="purple.700"
                                            boxSize="20px"
                                        />
                                    </Tooltip>
                                </Slider>
                            </HStack>
                        </VStack>
                    )}
                />

                <Controller
                    name="extraTime"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <VStack alignItems="start" spacing="0.5rem">
                            <Text variant="modalH2" fontSize="0.875rem">Extra time duration</Text>
                            <ButtonGroup isAttached>
                                {EXTRA_TIMER_OPTIONS.map((opt) => (
                                    <Button
                                        borderRadius="12px"
                                        width="80px"
                                        key={opt.label}
                                        onClick={() => onChange(opt.value)}
                                        variant="outline"
                                        borderColor="gray.600"
                                        colorScheme={value === opt.value ? 'blue' : 'gray'}
                                        bg={value === opt.value ? 'purple.800' : 'transparent'}
                                        _hover={{ bg: value === opt.value ? 'purple.700' : 'gray.700' }}
                                        _active={{ bg: value === opt.value ? 'purple.700' : 'gray.700' }}
                                    >
                                        <Text fontSize="0.875rem">{opt.label}</Text>
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </VStack>
                    )}
                />

                <Controller
                    name="rabbitHunting"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <VStack alignItems="start" spacing="0.5rem">
                            <Text variant="modalH2">
                                Allow players to see undealt cards? (Rabbit
                                Hunting)
                            </Text>
                            <ButtonGroup isAttached>
                                {['Yes', 'No'].map((option) => (
                                    <Button
                                        key={option}
                                        w="80px"
                                        borderRadius="12px"
                                        onClick={() => onChange(option === 'Yes')}
                                        variant="outline"
                                        borderColor="gray.600"
                                        colorScheme={value === (option === 'Yes') ? 'blue' : 'gray'}
                                        bg={value === (option === 'Yes') ? 'purple.800' : 'transparent'}
                                        _hover={{ bg: value === (option === 'Yes') ? 'purple.700' : 'gray.700' }}
                                        _active={{ bg: value === (option === 'Yes') ? 'purple.700' : 'gray.700' }}
                                    >
                                        <Text variant="modalH2">{option}</Text>
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </VStack>
                    )}
                />

                <Controller
                    name="showdownTimer"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <VStack alignItems="start" spacing="0.5rem" pb="1rem">
                            <Text variant="modalH2" fontSize="0.875rem">Showdown presentation time</Text>
                            <ButtonGroup isAttached>
                                {SHOWDOWN_OPTIONS.map((opt) => (
                                    <Button
                                        borderRadius="12px"
                                        width="110px"
                                        key={opt.label}
                                        onClick={() => onChange(opt.value)}
                                        variant="outline"
                                        borderColor="gray.600"
                                        colorScheme={value === opt.value ? 'blue' : 'gray'}
                                        bg={value === opt.value ? 'purple.800' : 'transparent'}
                                        _hover={{ bg: value === opt.value ? 'purple.700' : 'gray.700' }}
                                        _active={{ bg: value === opt.value ? 'purple.700' : 'gray.700' }}
                                    >
                                        <Text fontSize="0.875rem">{opt.label}</Text>
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </VStack>
                    )}
                />
                {/* Ante Section */}
                <VStack spacing="1rem" w="100%" alignItems="start">
                    <VStack alignItems="flex-start" spacing="0.15rem" w="100%">
                        <HStack spacing="0.5rem" alignItems="center">
                            <FaPlus color="#9F7AEA" size="18px" />
                            <Text variant="modalH1">Ante</Text>
                            <Text fontSize="1rem" fontWeight="bold" color="purple.400">{`${ante?.toFixed(1)} BB`}</Text>
                        </HStack>
                        <Text 
                            color="brand.white90" 
                            fontSize="0.75rem" 
                            letterSpacing="0.05rem"
                            opacity="0.8"
                        >
                            Applies before pre-flop action - inactive for bomb pots
                        </Text>
                    </VStack>
                    <Controller
                        name="ante"
                        control={control}
                        render={({ field }) => (
                            <HStack w="100%" spacing="1.5rem">
                                <Text variant="sliderText">0 BB</Text>
                                <Slider
                                    w="90%"
                                    minWidth="18rem"
                                    maxWidth="65%"
                                    min={0}
                                    max={2}
                                    step={0.1}
                                    value={field.value}
                                    onChange={field.onChange}
                                >
                                    <SliderTrack bg="gray.600">
                                        <SliderFilledTrack bg="purple.700" />
                                    </SliderTrack>
                                    <Tooltip
                                        hasArrow
                                        bg="brand.gray20"
                                        color="white"
                                        placement="bottom"
                                        label={`${field.value.toFixed(1)} BB`}
                                    >
                                        <SliderThumb bg="purple.700" />
                                    </Tooltip>
                                </Slider>
                                <Text variant="sliderText">2 BB</Text>
                            </HStack>
                        )}
                    />
                </VStack>
                {/* Bomb Pot Section */}
                <VStack alignItems="start" spacing="0.75rem" w="100%" pt="0.5rem">
                    <VStack alignItems="flex-start" spacing="0.15rem" w="100%">
                        <HStack spacing="0.5rem" alignItems="center">
                            <FaBomb color="#9F7AEA" size="18px" />
                            <Text variant="modalH1">Bomb Pot</Text>
                        </HStack>
                        <Text 
                            color="brand.white90" 
                            fontSize="0.75rem" 
                            letterSpacing="0.05rem"
                            opacity="0.8"
                        >
                            Requires both ante and frequency to activate bomb pots
                        </Text>
                    </VStack>
                    <HStack w="100%" spacing="2.5rem" alignItems="flex-start">
                        <Controller
                            name="bombPotBB"
                            control={control}
                            render={({ field }) => {
                                const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                                    const val = e.target.value;
                                    if (val === "" || (/^\d+$/.test(val) && Number(val) >= 0 && Number(val) <= 10)) {
                                        field.onChange(val === "" ? 0 : Number(val));
                                    }
                                };
                                return (
                                    <VStack alignItems="flex-start" spacing="0.25rem" w="125px">
                                        <Text variant="modalH2">Ante</Text>
                                        <HStack w="100%">
                                            <input
                                                type="number"
                                                min={1}
                                                max={10}
                                                step={1}
                                                value={field.value === 0 ? "" : field.value}
                                                onChange={handleChange}
                                                placeholder="1-10"
                                                style={{
                                                    width: '100%',
                                                    border: showBBError ? '1px solid #E53E3E' : '1px solid #444',
                                                    borderRadius: '8px',
                                                    padding: '4px 8px',
                                                    fontSize: '1rem',
                                                    background: 'transparent',
                                                    outline: 'none',
                                                    color: '#9F7AEA',
                                                }}
                                                onFocus={e => e.currentTarget.style.boxShadow = 'none'}
                                                onBlur={e => e.currentTarget.style.boxShadow = 'none'}
                                            />
                                            <Text color="gray.400" fontSize="0.9rem" pl="6px">BB</Text>
                                        </HStack>
                                    </VStack>
                                );
                            }}
                        />
                        <Controller
                            name="bombPotFrequency"
                            control={control}
                            render={({ field }) => {
                                const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                                    const val = e.target.value;
                                    if (val === "" || (/^\d+$/.test(val) && Number(val) >= 0 && Number(val) <= 30)) {
                                        field.onChange(val === "" ? 0 : Number(val));
                                    }
                                };
                                return (
                                    <VStack alignItems="flex-start" spacing="0.25rem" w="150px">
                                        <Text variant="modalH2">Frequency</Text>
                                        <HStack w="100%">
                                            <input
                                                type="number"
                                                min={1}
                                                max={30}
                                                step={1}
                                                value={field.value === 0 ? "" : field.value}
                                                onChange={handleChange}
                                                placeholder="1-30"
                                                style={{
                                                    width: '100%',
                                                    border: showFreqError ? '1px solid #E53E3E' : '1px solid #444',
                                                    borderRadius: '8px',
                                                    padding: '4px 8px',
                                                    fontSize: '1rem',
                                                    background: 'transparent',
                                                    outline: 'none',
                                                    color: '#9F7AEA',
                                                }}
                                                onFocus={e => e.currentTarget.style.boxShadow = 'none'}
                                                onBlur={e => e.currentTarget.style.boxShadow = 'none'}
                                            />
                                            <Text color="gray.400" fontSize="0.9rem" pl="6px">Hands</Text>
                                        </HStack>
                                    </VStack>
                                );
                            }}
                        />
                    </HStack>
                </VStack>
            </VStack>
        </VStack>
    );
};

export default GameOptions;
