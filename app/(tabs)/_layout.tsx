
//@ts-nocheck for removing ts related errorsimport { Redirect, router, Tabs } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSession } from '@/hooks/ctx';
// import { getProfile } from '@/db/profile';
import { ProfilePic } from '@/components/ProfilePic';
import { Redirect, Tabs, useRouter } from 'expo-router';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { session, isLoading } = useSession();
  const router = useRouter();

 // sessions checking - is user logged in?
  if (isLoading) {
    return null;
  }

  // replaced a useEffect previously had, with this. sees if session is null AKA user is not signed in, reroutes to login
  if (session === null) {
    return <Redirect href="/auth" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <ProfilePic tab />,
        }}
      />
    </Tabs>
  );
}
