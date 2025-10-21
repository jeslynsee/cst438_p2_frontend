
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

  // useEffect(() => {
  //   getProfile(session).then((res) => {
  //     if (res && session) {
  //       router.push('/(tabs)')
  //     } else {
  //       router.push('/sign-up')
  //     }
  //   }).catch(err => {
  //     console.error(err)
  //   })
  // }, [])

  // handle sign out function under, using useEffect, so we don't get "fewer hooks rendered than expected error"
  useEffect(() => {
    if (session === null) { // session gets set to null when doing sign out process, so doing comp here to send user back to login pg
      router.replace("/auth");
    }
  }, [session]); // have it depend on session, if session turns null => reroute to login page

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
