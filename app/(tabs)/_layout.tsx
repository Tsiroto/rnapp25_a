import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, router } from 'expo-router';
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useAudio } from '@/utils/useAudio';

function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();
    // Initialize audio hook with opening track but don't play it automatically
    const { playEffect } = useAudio('opening', false);

    // Custom tab bar button for Play that navigates to gameScreen
    const PlayTabButton = (props: any) => {
        return (
            <TouchableOpacity
                {...props}
                onPress={async () => {
                    // Play click sound effect
                    await playEffect('click');
                    // Navigate to game screen
                    router.push('/gameScreen');
                }}
            />
        );
    };

    // Custom tab bar button for Settings that plays sound
    const SettingsTabButton = (props: any) => {
        return (
            <TouchableOpacity
                {...props}
                onPress={async () => {
                    // Play click sound effect
                    await playEffect('click');
                    // Navigate to settings tab
                    router.push('/(tabs)/settings');
                }}
            />
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <Tabs
                    screenOptions={{
                        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                        headerShown: false,
                    }}
                >
                    <Tabs.Screen
                        name="index"
                        options={{
                            title: 'Play',
                            tabBarIcon: ({ color }) => <TabBarIcon name="gamepad" color={color} />,
                            headerShown: false,
                            tabBarButton: PlayTabButton,
                        }}
                    />
                    <Tabs.Screen
                        name="settings"
                        options={{
                            title: 'Settings',
                            tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
                            tabBarButton: SettingsTabButton,
                        }}
                    />
                </Tabs>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
