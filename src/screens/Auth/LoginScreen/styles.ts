import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
    /* ================= CONTAINER ================= */
    container: {
        flex: 1,
        backgroundColor: '#F9FAFC',
    },

    /* ================= TOP LOGO ================= */
    topContainer: {
        flex: 4, // 👈 30%
        backgroundColor: '#EEF3FB',
        justifyContent: 'center',
        alignItems: 'center',

        overflow: 'hidden',
    },

    logo: {
        width: '100%',
        height: '100%',
    },

    /* ================= FORM ================= */
    formContainer: {
        flex: 6, // 👈 70%
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

    subTitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 28,
    },

    /* ================= INPUT ================= */
    input: {
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
    },

    inputOutline: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },

    /* ================= FORGOT ================= */
    forgotContainer: {
        alignItems: 'flex-end',
        marginBottom: 28,
    },

    forgotText: {
        color: '#2563EB',
        fontSize: 14,
        fontWeight: '600',
    },

    /* ================= LOGIN BUTTON ================= */
    loginButton: {
        height: 54,
        borderRadius: 18,
        justifyContent: 'center',
        backgroundColor: '#2563EB',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },

    loginLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },

    /* ================= DIVIDER ================= */
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },

    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },

    dividerText: {
        marginHorizontal: 12,
        fontSize: 12,
        fontWeight: '600',
        color: '#9CA3AF',
    },

    /* ================= REGISTER BUTTON ================= */
    registerButton: {
        height: 52,
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: '#2563EB',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },

    registerLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#2563EB',
    },
});
