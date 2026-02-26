import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from '../constants/constants';
import { getAllStates, getCitiesByState } from '../constants/locations';

interface LocationSelectorAdvancedProps {
    onLocationSelect: (state: string, city: string) => void;
    selectedState?: string;
    selectedCity?: string;
    placeholder?: string;
    isVisible?: boolean;
    onClose?: () => void;
    requireCity?: boolean; // If true, city is required (for providers). If false, city is optional (for users)
    mode?: 'user' | 'provider'; // Simplified mode prop
}

export default function LocationSelectorAdvanced({
    onLocationSelect,
    selectedState = '',
    selectedCity = '',
    placeholder = 'Select Location',
    isVisible,
    onClose,
    requireCity = true, // Default to required (provider mode)
    mode = 'provider', // Default to provider mode
}: LocationSelectorAdvancedProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [step, setStep] = useState<'state' | 'city'>('state');
    const [tempState, setTempState] = useState(selectedState);
    const [searchQuery, setSearchQuery] = useState('');
    const [states] = useState(getAllStates());
    const [cities, setCities] = useState<string[]>([]);

    // Use external visibility if provided, otherwise use internal state
    const isModalVisible = isVisible !== undefined ? isVisible : modalVisible;

    // Determine if city is optional based on mode or requireCity prop
    const isCityOptional = mode === 'user' || !requireCity;

    useEffect(() => {
        if (tempState) {
            setCities(getCitiesByState(tempState));
        }
    }, [tempState]);

    const handleStateSelect = (state: string) => {
        setTempState(state);
        setStep('city');
        setSearchQuery('');
    };

    const handleCitySelect = (city: string) => {
        onLocationSelect(tempState, city);
        if (onClose) {
            onClose();
        } else {
            setModalVisible(false);
        }
        setStep('state');
        setSearchQuery('');
    };

    const handleAllCitiesSelect = () => {
        // For users: select entire state (all cities)
        onLocationSelect(tempState, ''); // Empty city means all cities in the state
        if (onClose) {
            onClose();
        } else {
            setModalVisible(false);
        }
        setStep('state');
        setSearchQuery('');
    };

    const getDisplayText = () => {
        if (selectedState && !selectedCity) {
            return `All of ${selectedState}`; // Show "All of Lagos" when only state is selected
        }
        if (selectedCity && selectedState) {
            return `${selectedCity}, ${selectedState}`;
        }
        return placeholder;
    };

    const filteredData = () => {
        if (!searchQuery) {
            if (step === 'state') return states;
            if (step === 'city') return cities;
        }

        const query = searchQuery.toLowerCase();
        if (step === 'state') {
            return states.filter(s => s.toLowerCase().includes(query));
        }
        if (step === 'city') {
            return cities.filter(c => c.toLowerCase().includes(query));
        }
        return [];
    };

    const renderStepIndicator = () => (
        <View style={styles.stepIndicator}>
            <View style={[styles.stepDot, step === 'state' && styles.stepDotActive]} />
            <View style={styles.stepLine} />
            <View style={[styles.stepDot, step === 'city' && styles.stepDotActive]} />
        </View>
    );

    return (
        <View>
            {isVisible === undefined && (
                <TouchableOpacity
                    style={styles.selector}
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.8}
                >
                    <View style={styles.selectorContent}>
                        <Text style={styles.selectorIcon}>📍</Text>
                        <Text
                            style={[
                                styles.selectorText,
                                !selectedCity && styles.selectorPlaceholder,
                            ]}
                            numberOfLines={1}
                        >
                            {getDisplayText()}
                        </Text>
                    </View>
                    <Text style={styles.selectorArrow}>▼</Text>
                </TouchableOpacity>
            )}

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => {
                    if (onClose) {
                        onClose();
                    } else {
                        setModalVisible(false);
                    }
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalTitle}>
                                    Select {step === 'state' ? 'State' : 'City'}
                                </Text>
                                {tempState && (
                                    <Text style={styles.modalSubtitle}>
                                        {tempState}
                                    </Text>
                                )}
                            </View>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => {
                                    if (onClose) {
                                        onClose();
                                    } else {
                                        setModalVisible(false);
                                    }
                                    setStep('state');
                                    setSearchQuery('');
                                }}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Step Indicator */}
                        {renderStepIndicator()}

                        {/* Back Button */}
                        {step !== 'state' && (
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => {
                                    setStep('state');
                                    setSearchQuery('');
                                }}
                            >
                                <Text style={styles.backButtonText}>← Back</Text>
                            </TouchableOpacity>
                        )}

                        {/* Search */}
                        <View style={styles.searchContainer}>
                            <Text style={styles.searchIcon}>🔍</Text>
                            <TextInput
                                style={styles.searchInput}
                                placeholder={`Search ${step}...`}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholderTextColor={COLORS.TEXT_TERTIARY}
                            />
                        </View>

                        {/* "All Cities" option for users in city step */}
                        {step === 'city' && isCityOptional && (
                            <TouchableOpacity
                                style={styles.allCitiesButton}
                                onPress={handleAllCitiesSelect}
                            >
                                <View style={styles.allCitiesContent}>
                                    <Text style={styles.allCitiesIcon}>🌍</Text>
                                    <View style={styles.allCitiesTextContainer}>
                                        <Text style={styles.allCitiesText}>All Cities in {tempState}</Text>
                                        <Text style={styles.allCitiesSubtext}>Show all services in this state</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}

                        {/* List */}
                        <FlatList
                            data={filteredData()}
                            keyExtractor={(item, index) => `${item}-${index}`}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.listItem}
                                    onPress={() => {
                                        if (step === 'state') handleStateSelect(item);
                                        else handleCitySelect(item);
                                    }}
                                >
                                    <Text style={styles.listItemText}>{item}</Text>
                                    <Text style={styles.listItemArrow}>→</Text>
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>No results found</Text>
                                </View>
                            }
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.WHITE,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        borderWidth: 2,
        borderColor: COLORS.BORDER,
        ...SHADOWS.small,
    },
    selectorContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    selectorIcon: {
        fontSize: 20,
        marginRight: SPACING.sm,
    },
    selectorText: {
        fontSize: FONT_SIZE.md,
        color: COLORS.TEXT_PRIMARY,
        fontWeight: FONT_WEIGHT.medium,
        flex: 1,
    },
    selectorPlaceholder: {
        color: COLORS.TEXT_TERTIARY,
    },
    selectorArrow: {
        fontSize: 12,
        color: COLORS.TEXT_SECONDARY,
        marginLeft: SPACING.sm,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: COLORS.BACKDROP,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.WHITE,
        borderTopLeftRadius: BORDER_RADIUS.xxl,
        borderTopRightRadius: BORDER_RADIUS.xxl,
        maxHeight: '90%',
        paddingBottom: SPACING.xl,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: SPACING.xl,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
    },
    modalTitle: {
        fontSize: FONT_SIZE.xxl,
        fontWeight: FONT_WEIGHT.bold,
        color: COLORS.TEXT_PRIMARY,
    },
    modalSubtitle: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.TEXT_SECONDARY,
        marginTop: SPACING.xs,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.GRAY_100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        color: COLORS.TEXT_SECONDARY,
        fontWeight: FONT_WEIGHT.bold,
    },
    stepIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
    },
    stepDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.GRAY_300,
    },
    stepDotActive: {
        backgroundColor: COLORS.PRIMARY,
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    stepLine: {
        width: 40,
        height: 2,
        backgroundColor: COLORS.GRAY_300,
        marginHorizontal: SPACING.xs,
    },
    backButton: {
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.sm,
    },
    backButtonText: {
        fontSize: FONT_SIZE.md,
        color: COLORS.PRIMARY,
        fontWeight: FONT_WEIGHT.semibold,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.GRAY_50,
        borderRadius: BORDER_RADIUS.lg,
        marginHorizontal: SPACING.xl,
        marginVertical: SPACING.md,
        paddingHorizontal: SPACING.md,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: SPACING.sm,
    },
    searchInput: {
        flex: 1,
        paddingVertical: SPACING.md,
        fontSize: FONT_SIZE.md,
        color: COLORS.TEXT_PRIMARY,
    },
    popularSection: {
        paddingVertical: SPACING.md,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: FONT_WEIGHT.semibold,
        color: COLORS.TEXT_PRIMARY,
        paddingHorizontal: SPACING.xl,
        marginBottom: SPACING.sm,
    },
    popularList: {
        paddingHorizontal: SPACING.xl,
        gap: SPACING.md,
    },
    popularItem: {
        backgroundColor: COLORS.PRIMARY + '10',
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        marginRight: SPACING.sm,
        minWidth: 120,
        borderWidth: 1,
        borderColor: COLORS.PRIMARY + '30',
    },
    popularCity: {
        fontSize: FONT_SIZE.md,
        fontWeight: FONT_WEIGHT.bold,
        color: COLORS.PRIMARY,
    },
    popularLGA: {
        fontSize: FONT_SIZE.xs,
        color: COLORS.TEXT_SECONDARY,
        marginTop: 2,
    },
    popularState: {
        fontSize: FONT_SIZE.xs,
        color: COLORS.TEXT_TERTIARY,
        marginTop: 2,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.xl,
    },
    listItemText: {
        fontSize: FONT_SIZE.md,
        color: COLORS.TEXT_PRIMARY,
        fontWeight: FONT_WEIGHT.medium,
        flex: 1,
    },
    listItemArrow: {
        fontSize: 16,
        color: COLORS.TEXT_TERTIARY,
    },
    separator: {
        height: 1,
        backgroundColor: COLORS.BORDER,
        marginHorizontal: SPACING.xl,
    },
    emptyContainer: {
        padding: SPACING.xxxl,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: FONT_SIZE.md,
        color: COLORS.TEXT_SECONDARY,
    },
    allCitiesButton: {
        marginHorizontal: SPACING.xl,
        marginBottom: SPACING.md,
        backgroundColor: COLORS.PRIMARY + '10',
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 2,
        borderColor: COLORS.PRIMARY + '30',
        overflow: 'hidden',
    },
    allCitiesContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
    },
    allCitiesIcon: {
        fontSize: 24,
        marginRight: SPACING.md,
    },
    allCitiesTextContainer: {
        flex: 1,
    },
    allCitiesText: {
        fontSize: FONT_SIZE.md,
        fontWeight: FONT_WEIGHT.bold,
        color: COLORS.PRIMARY,
        marginBottom: 2,
    },
    allCitiesSubtext: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.TEXT_SECONDARY,
    },
});
