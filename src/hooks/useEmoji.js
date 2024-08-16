import { useQuery } from '@tanstack/react-query';

const useEmojiData = () => {
  return useQuery({
    queryKey: ['emoji'],
    queryFn: async () => {
      const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
			console.log(data)
      return data;
    },
    staleTime: 86400000, 
    cacheTime: 86400000,
  });
};

export default useEmojiData;
