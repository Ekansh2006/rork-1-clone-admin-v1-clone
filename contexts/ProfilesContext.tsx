import { useState, useCallback } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { Profile, Comment } from '@/types/profile';

export const [ProfilesProvider, useProfiles] = createContextHook(() => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const addProfile = useCallback((newProfile: Omit<Profile, 'id' | 'commentCount' | 'comments' | 'greenFlags' | 'redFlags' | 'userVote'>) => {
    const profile: Profile = {
      ...newProfile,
      id: Date.now().toString(),
      commentCount: 0,
      comments: [],
      greenFlags: 0,
      redFlags: 0,
      userVote: null,
    };
    
    setProfiles(prevProfiles => [profile, ...prevProfiles]);
    return profile;
  }, []);

  const addComment = useCallback((profileId: string, commentText: string) => {
    setProfiles(prevProfiles => 
      prevProfiles.map(profile => {
        if (profile.id === profileId) {
          const newComment: Comment = {
            id: `${profileId}-comment-${Date.now()}`,
            userId: 'current-user',
            username: 'you',
            text: commentText,
            timestamp: new Date()
          };
          
          return {
            ...profile,
            comments: [newComment, ...profile.comments],
            commentCount: profile.commentCount + 1
          };
        }
        return profile;
      })
    );
  }, []);
  
  const vote = useCallback((profileId: string, voteType: 'green' | 'red') => {
    setProfiles(prevProfiles => 
      prevProfiles.map(profile => {
        if (profile.id === profileId) {
          const wasGreen = profile.userVote === 'green';
          const wasRed = profile.userVote === 'red';
          
          let newGreenFlags = profile.greenFlags;
          let newRedFlags = profile.redFlags;
          
          // Remove previous vote if exists
          if (wasGreen) {
            newGreenFlags -= 1;
          } else if (wasRed) {
            newRedFlags -= 1;
          }
          
          // Add new vote
          if (voteType === 'green') {
            newGreenFlags += 1;
          } else {
            newRedFlags += 1;
          }
          
          return {
            ...profile,
            userVote: voteType,
            greenFlags: newGreenFlags,
            redFlags: newRedFlags
          };
        }
        return profile;
      })
    );
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return {
    profiles,
    isLoading,
    refreshing,
    addProfile,
    addComment,
    vote,
    refresh,
  };
});