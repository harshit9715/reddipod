"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Image from "next/image";
import React from "react";
import PodcastDetailPlayer from "@/components/PodcastDetailPlayer";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import EmptyState from "@/components/EmptyState";
import { useUser } from "@clerk/nextjs";

const PodcastDetails = ({ params }: { params: { id: Id<"podcasts"> } }) => {
  const {user} = useUser();
  const podcast = useQuery(api.podcast.getPodcastById, {
    podcastId: params.id!,
  });

  const similarPodcasts = useQuery(api.podcast.getPodcastByVoiceType, {
    podcastId: params.id!,
  });
  const isOwner = user?.id === podcast?.authorId;
  if (!podcast || !similarPodcasts) return <LoaderSpinner />;
  return (
    <section className="flex w-full flex-col ">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white-1">Currently Playing</h1>
        <figure className="flex gap-3">
          <Image
            src="/icons/headphone.svg"
            width={24}
            height={24}
            alt="headphone"
          />
          <h2 className="text-16 font-bold text-white-1">{podcast?.views}</h2>
        </figure>
      </header>
      {/* @ts-expect-error */}
      {podcast && <PodcastDetailPlayer isOwner={isOwner} {...podcast} podcastId={podcast._id} />}
      <p className="text-16 text-white-1 pb-8 pt-[45px] font-medium max-md:text-center">
        {podcast?.podcastDescription}
      </p>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Transcription</h1>
          <p className="text-16 font-medium text-white-2">{podcast?.voicePrompt}</p>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Thumbnail Prompt</h1>
          <p className="text-16 font-medium text-white-2">{podcast?.imagePrompt}</p>
        </div>
      </div>
      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Similar Podcasts</h1>
        {similarPodcasts && similarPodcasts.length > 0 ? (
          <div>
            {similarPodcasts.map(({_id, imageUrl, podcastTitle, podcastDescription}) => (
              <PodcastCard
              key={_id}
              imgUrl={imageUrl!}
              title={podcastTitle}
              description={podcastDescription}
              podcastId={_id as any}
            />
            ))}
          </div>
        ): (<>
        <EmptyState
          title="No Similar Podcasts found"
          buttonLink="/discover"
          buttonText="Discover podcasts"
        /></>)}
      </section>
    </section>
  );
};

export default PodcastDetails;
