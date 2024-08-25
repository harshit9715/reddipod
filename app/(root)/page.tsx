"use client";
import PodcastCard from "@/components/PodcastCard";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const Home = () => {
  const trendingPodcasts = useQuery(api.podcast.getTrendingPodcasts);
  return (
    <div>
      <h1 className="text-20 font-bold text-white-1">Trending Podcast</h1>
      <div className="podcast_grid">
        {trendingPodcasts?.map(
          ({ _id, imageUrl, podcastTitle, podcastDescription }) => (
            <PodcastCard
              key={_id}
              imgUrl={imageUrl!}
              title={podcastTitle}
              description={podcastDescription}
              podcastId={_id as any}
            />
          ),
        )}
      </div>
    </div>
  );
};

export default Home;
