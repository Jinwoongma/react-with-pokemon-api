import { useCallback, useEffect } from 'react';

interface UseInfiniteScrollProps {
    loadMore: () => void;
    hasMore: boolean;
}

export const useInfiniteScroll = ({ loadMore, hasMore }: UseInfiniteScrollProps) => {
    const handleScroll = useCallback(() => {
        if (!hasMore) return;

        const scrollElement = document.scrollingElement || document.documentElement;
        if (window.innerHeight + scrollElement.scrollTop + 1 >= scrollElement.scrollHeight) {
            loadMore();
        }
    }, [loadMore, hasMore]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return null;
};
