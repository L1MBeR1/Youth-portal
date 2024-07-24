import { useQuery } from '@tanstack/react-query';
import { getPodcastsByPage } from '../api/podcastsApi';
import { getToken } from '../localStorage/tokenStorage';

const usePodcasts = (queryKey,tags,page, setLastPage,searchValue,crtFrom,crtTo) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const token = getToken();
      const response = await getPodcastsByPage(token, page,'title',searchValue,crtFrom,crtTo);
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