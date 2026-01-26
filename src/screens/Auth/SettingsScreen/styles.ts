import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    patternOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    pattern: {
        ...StyleSheet.absoluteFillObject,
    },
    dot: {
        position: 'absolute',
        width: 3,
        height: 3,
        borderRadius: 1.5,
    },
    content: {
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#ffffff',
        opacity: 0.9,
    },
    card: {
        marginBottom: 20,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        elevation: 8,
    },
    cardContent: {
        paddingVertical: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        marginLeft: 8,
    },
    listItem: {
        paddingVertical: 8,
    },
    listValue: {
        color: '#666',
        fontSize: 16,
    },
    loginButton: {
        borderRadius: 12,
        marginTop: 20,
        marginBottom: 40,
        elevation: 5,
        shadowColor: '#FF6B6B',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    button: {
        borderRadius: 12,
        backgroundColor: 'transparent',
    },
    buttonContent: {
        paddingVertical: 12,
        paddingHorizontal: 32,
    },
    buttonLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
    },
});
