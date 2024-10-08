"use client";
import { api } from "@/convex/_generated/api";
import { GeneratePodcastProps } from "@/types";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import "@xixixao/uploadstuff/react/styles.css";
import { useAction, useMutation } from "convex/react";
import { Loader } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";

const useGeneratePodcast = ({
  setAudio,
  voicePrompt,
  voiceType,
  setAudioStorageId,
}: GeneratePodcastProps) => {
  // 1. logic to generate podcast
  const getPodcastAudio = useAction(api.openai.generateAudioAction);
  const [isGenerating, setIsGenerating] = useState(false);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getAudioUrl = useMutation(api.podcast.getUrl);
  const { toast } = useToast();
  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio("");
    if (!voicePrompt) {
      toast({
        title: "No voice prompt provided",
      });
      return setIsGenerating(false);
    }
    try {
      const response = await getPodcastAudio({
        input: voicePrompt,
        voiceType,
      });

      const blob = new Blob([response], { type: "audio/mpeg" });
      const filename = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], filename, { type: "audio/mpeg" });
      const uploaded = await startUpload([file]);
      const storageId = await (uploaded[0].response as any).storageId;
      setAudioStorageId(storageId);
      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      toast({
        title: "Podcast generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error generating podcast",
        variant: "destructive",
      });
      console.error(`Error generating podcast: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };
  return {
    isGenerating,
    generatePodcast,
  };
};

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { generatePodcast, isGenerating } = useGeneratePodcast(props);
  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          AI Prompt to generate Podcast
        </Label>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder="Provide text to generate audio"
          rows={5}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
          value={props.voicePrompt}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          className="text-16 bg-orange-1 py-4 font-bold text-white-1"
          type="button"
          onClick={() => generatePodcast()}
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="ml-2 animate-spin" />
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
      {props.audio && (
        <audio
          controls
          autoPlay
          src={props.audio}
          className="mt-5"
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
        />
      )}
    </div>
  );
};

export default GeneratePodcast;
