import { useQuery } from '@tanstack/react-query';
import { getPodcastsByPage } from '../api/podcastsApi';
import { getToken } from '../utils/authUtils/tokenStorage';

const usePodcasts = (queryKey,tags,setLastPage, params) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const {token}= await getToken('usePodcasts');
      if (!token) {
        return null;
      }
      const response = await getPodcastsByPage(token, params);
      setLastPage(response.message.last_page)
      console.log(response)
      return response.data;
    },
    meta: {
      tags: tags
    },
    keepPreviousData: true,
    staleTime: 300000,
    cacheTime: 600000,
  });
};

export default usePodcasts;