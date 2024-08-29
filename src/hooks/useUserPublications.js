import { useQueries } from '@tanstack/react-query';
import { getUserPublishedBlogs } from '../api/blogsApi';
import { getUserPublishedNews } from '../api/newsApi';
import { getUserPublishedPodcasts } from '../api/podcastsApi';

const usePublications = (user_id) => {
  const queries = useQueries({
    queries: [
      {
        queryKey: ['userPodcasts', user_id],
        queryFn: async () => {
          const response = await getUserPublishedPodcasts(user_id);
          return response.data;
        },
        staleTime: 100000,
        cacheTime: 100000,
        retry: 1,
      },
      {
        queryKey: ['userBlogs', user_id],
        queryFn: async () => {
          const response = await getUserPublishedBlogs(user_id);
          return response.data;
        },
        staleTime: 100000,
        cacheTime: 100000,
        retry: 1,
      },
      {
        queryKey: ['userNews', user_id],
        queryFn: async () => {
          const response = await getUserPublishedNews(user_id);
          return response.data;
        },
        staleTime: 100000,
        cacheTime: 100000,
        retry: 1,
      },
    ],
  });

  return queries;
};

export default usePublications;
