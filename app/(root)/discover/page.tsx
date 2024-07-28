"use client";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import SearchBar from "@/components/SearchBar";

const Discover = ({
  searchParams: { search },
}: {
  searchParams: { search?: "" };
}) => {
  const podcastData = useQuery(api.podcast.getPodcastBySearch, {
    search: search || "",
  });
  return (
    <div className="flex flex-col gap-9">
      <SearchBar />
      <div className="flex flex-col gap-9">
        <h1 className="text-20 font-bold text-white-1">
          {!search ? "Discover Trending Podcasts" : "Search results for "}
          {search && <span className="text-white-2">{search}</span>}
        </h1>
        {podcastData ? (
          <>
            {podcastData.length > 0 ? (
              podcastData.map((podcast) => (
                <div className="podcast_grid" key={podcast._id}>
                  <PodcastCard
                    podcastId={podcast._id}
                    description={podcast.podcastDescription}
                    title={podcast.podcastTitle}
                    imgUrl={podcast.imageUrl!}
                  />
                </div>
              ))
            ) : (
              <EmptyState title="No results found" />
            )}
          </>
        ) : (
          <LoaderSpinner />
        )}
      </div>
    </div>
  );
};

export default Discover;
