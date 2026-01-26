import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
export const HEADER_MAX_HEIGHT = 200;
export const HEADER_MIN_HEIGHT = 80;
export const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContent: {
        paddingTop: HEADER_MAX_HEIGHT + 20,
        paddingBottom: 20,
    },
    cardsContainer: {
        marginBottom: 0,
    },
    bottomSpacing: {
        height: 20,
    },
}); 