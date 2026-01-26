import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

    topContainer: {
        flex: 4,
        backgroundColor: '#EEF3FB',
    },

    logo: {
        width: '100%',
        height: '100%',
    },

    formContainer: {
        flex: 6, 
        paddingHorizontal: 24,
        paddingTop: 28,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -20,
    },

    title: {
        fontSize: 30,
        fontWeight: '700',
        color: '#0B1E3D',
        textAlign: 'center',
        marginBottom: 6,
    },

    input: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },

    inputOutline: {
        borderRadius: 16,
        borderWidth: 1,
    },

    /* ================= FORGOT ================= */
    forgotContainer: {
        alignItems: 'flex-end',
        marginBottom: 24,
    },

    forgotText: {
        color: '#0A5CFF',
        fontSize: 14,
        fontWeight: '500',
    },

    /* ================= BUTTON ================= */
    loginButton: {
        borderRadius: 16,
        height: 54,
        justifyContent: 'center',
        backgroundColor: '#0A5CFF',
        elevation: 4,
        shadowColor: '#0A5CFF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },

    loginLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        letterSpacing: 0.5,
    },

    /* ================= REGISTER / FOOTER ================= */
    registerFooter: {
        marginTop: 28,
        alignItems: 'center',
    },

    registerText: {
        fontSize: 14,
        color: '#555',
    },

    registerLink: {
        color: '#0A5CFF',
        fontWeight: '600',
    },
});
