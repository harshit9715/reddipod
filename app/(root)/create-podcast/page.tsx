"use client";
import GeneratePodcast from "@/components/GeneratePodcast";
import GenerateThumbnail from "@/components/GenerateThumbnail";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  podcastTitle: z.string().min(2).max(120),
  podcastDescription: z.string().min(2).max(500),
});

const voiceCategories = ["alloy", "nova", "shimmer", "echo", "fable", "onyx"];

const CreatePodcast = () => {
  const [imagePrompt, setImagePrompt] = React.useState<string>("");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const [imageStorageId, setimageStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const [imageUrl, setImageUrl] = useState("");
  const [audioDuration, setAudioDuration] = useState(0);
  const [voicePrompt, setVoicePrompt] = useState("");
  const [voiceType, setVoiceType] = React.useState<string>("");
  const { toast } = useToast();
  const createPodcast = useMutation(api.podcast.createPodcast);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescription: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit({
    podcastTitle,
    podcastDescription,
  }: z.infer<typeof formSchema>) {
    try {
      if (!audioUrl || !imageUrl || !voiceType) {
        toast({
          title: "Please generate audio and image",
          variant: "destructive",
        });
        throw new Error("Please generate audio and image");
      }
      await createPodcast({
        podcastTitle,
        podcastDescription,
        audioUrl,
        imageUrl,
        voiceType,
        imagePrompt,
        voicePrompt,
        audioDuration,
        audioStorageId: audioStorageId!,
        imageStorageId: imageStorageId!,
        views: 0,
      });
      toast({
        title: "Podcast created successfully",
      });
      // TODO: push to podcast page
      router.push(`/`);
    } catch (error) {
      toast({
        title: "Error creating podcast",
        variant: "destructive",
      });
      console.error("Error submitting form", error);
    }
  }

  return (
    <section className="mt-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Create Podcast</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-12 flex w-full flex-col"
        >
          <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="input-class focus-visible:ring-offset-orange-1"
                      placeholder="My Inner Thoughts"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2.5">
              <Label className="text-16 font-bold text-white-1">
                Select AI Voice
              </Label>
              <Select onValueChange={(value) => setVoiceType(value)}>
                <SelectTrigger
                  className={cn(
                    "text-16 w-full border-none bg-black-1 text-gray-1"
                  )}
                >
                  <SelectValue
                    placeholder="Select AI Voice"
                    className="placeholder:text-gray-1"
                  />
                </SelectTrigger>
                <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus:ring-offset-orange-1">
                  {voiceCategories.map((category) => (
                    <SelectItem
                      className="capitalize focus:bg-orange-1"
                      key={category}
                      value={category}
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
                {voiceType && (
                  <audio
                    src={`/${voiceType}.mp3`}
                    autoPlay
                    className="hidden"
                  />
                )}
              </Select>
            </div>
            <FormField
              control={form.control}
              name="podcastDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="input-class focus-visible:ring-offset-orange-1"
                      placeholder="Write a short description of your podcast"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col pt-10">
            <GeneratePodcast
              setAudioStorageId={setAudioStorageId}
              setAudio={setAudioUrl}
              voiceType={voiceType}
              audio={audioUrl}
              voicePrompt={voicePrompt}
              setVoicePrompt={setVoicePrompt}
              setAudioDuration={setAudioDuration}
            />
            <GenerateThumbnail
              setImage={setImageUrl}
              image={imageUrl}
              setImagePrompt={setImagePrompt}
              setImageStorageId={setimageStorageId}
              imagePrompt={imagePrompt}
            />
            <div className="mt-10 w-full">
              <Button
                className="text-16 w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1"
                type="submit"
              >
                {form.formState.isValidating || form.formState.isSubmitting ? (
                  <>
                    Submitting
                    <Loader size={20} className="ml-2 animate-spin" />
                  </>
                ) : (
                  "Submit & Publish Podcast"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default CreatePodcast;
