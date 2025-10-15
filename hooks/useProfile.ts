import { useState, useEffect } from 'react';
import { getProfile } from '@/db/profile';
import { useSession } from './ctx';

const useProfile = () => {
  // const { session } = useSession();
  const [profile, setProfile] = useState<{ user: any; profile: any } | null>(null);

  useEffect(() => {
    // Mock profile data for navigation testing
    setProfile({
      user: { username: "Test User", profile_pic: null },
      profile: { age: 25, weight: 150, height: 70 }
    });
    
    // if (session) {
    //   getProfile(session).then((res) => {
    //     if (res) {
    //       setProfile(res)
    //     }
    //   }).catch((err) => {
    //     console.error(err)
    //   })
    // }
  }, []);

  return { profile };
};

export default useProfile;
