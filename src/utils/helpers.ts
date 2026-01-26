export const getGreeting = (language: 'en' | 'vi' = 'en'): string => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return language === 'vi' ? 'Chào buổi sáng' : 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
        return language === 'vi' ? 'Chào buổi chiều' : 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
        return language === 'vi' ? 'Chào buổi tối' : 'Good Evening';
    } else {
        return language === 'vi' ? 'Chúc ngủ ngon' : 'Good Night';
    }
};

export const convertTemperature = (temp: number, fromUnit: 'C' | 'F', toUnit: 'C' | 'F'): number => {
    if (fromUnit === toUnit) return temp;

    if (fromUnit === 'C' && toUnit === 'F') {
        return (temp * 9 / 5) + 32;
    } else {
        return (temp - 32) * 5 / 9;
    }
};

export const formatTemperature = (temp: number, unit: 'C' | 'F'): string => {
    return `${Math.round(temp)}°${unit}`;
};

export const getDeviceIcon = (type: string): string => {
    const icons: { [key: string]: string } = {
        light: 'lightbulb',
        ac: 'snowflake',
        tv: 'tv',
        fan: 'fan',
        door: 'door-open',
        camera: 'video',
    };
    return icons[type] || 'circle';
};

export const getRoomIcon = (name: string): string => {
    const icons: { [key: string]: string } = {
        'Living Room': 'sofa',
        'Bedroom': 'bed',
        'Kitchen': 'utensils',
        'Bathroom': 'bath',
        'Office': 'laptop',
        'Garage': 'car',
    };
    return icons[name] || 'home';
};

export const getRoomColor = (name: string): string => {
    const colors: { [key: string]: string } = {
        'Living Room': '#FF6B6B',
        'Bedroom': '#4ECDC4',
        'Kitchen': '#45B7D1',
        'Bathroom': '#96CEB4',
        'Office': '#FFEAA7',
        'Garage': '#DDA0DD',
    };
    return colors[name] || '#95A5A6';
};
