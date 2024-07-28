import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { GenerateThumbnailProps } from "@/types";
import { Loader } from "lucide-react";
import { Input } from "./ui/input";
import Image from "next/image";
import { useToast } from "./ui/use-toast";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";

const GenerateThumbnail = ({
  image,
  imagePrompt,
  setImage,
  setImagePrompt,
  setImageStorageId,
}: GenerateThumbnailProps) => {
  const [isAIThumbnail, setisAIThumbnail] = useState(false);
  const [isImgLoading, setIsImgLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const handleGenerateThumbnail = useAction(api.openai.generateThumbnailAction);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getImageUrl = useMutation(api.podcast.getUrl);

  const handleImage = async (blob: Blob, filename: string) => {
    setIsImgLoading(true);
    setImage("");
    try {
      const file = new File([blob], filename, { type: "image/png" });
      const uploaded = await startUpload([file]);
      const storageId = await (uploaded[0].response as any).storageId;
      setImageStorageId(storageId);
      const imageUrl = await getImageUrl({ storageId });
      setImage(imageUrl!);
      toast({
        title: "Thumbnail generated!",
      });
    } catch (error) {
      toast({
        title: "Error generating thumbnail",
        variant: "destructive",
      });
      console.log("Error in handleImage", error);
    } finally {
      setIsImgLoading(false);
    }
  };

  const generateImage = async () => {
    try {
      setIsImgLoading(true);
      const response = await handleGenerateThumbnail({ prompt: imagePrompt });
      const blob = new Blob([response], { type: "image/png" });
      await handleImage(blob, `aithumb-${uuidv4()}`);
    } catch (error) {
      console.log("Error in generateImage", error);
      toast({
        title: "Error generating thumbnail",
        variant: "destructive",
      });
    }
    finally {
      setIsImgLoading(false);
    }
  };

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    try {
      const files = event.target?.files;
      if (!files) {
        return;
      }
      const file = files![0];
      const blob = await file
        .arrayBuffer()
        .then((ab) => new Blob([ab], { type: file.type }));
      await handleImage(blob, file.name);
    } catch (error) {
      console.log("Error in uploadImage", error);
      toast({
        title: "Error uploading image",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="generate_thumbnail">
        <Button
          type="button"
          variant="plain"
          className={cn({
            "bg-black-6": isAIThumbnail,
          })}
          onClick={() => setisAIThumbnail(true)}
        >
          Use AI to generate thumbnail
        </Button>
        <Button
          type="button"
          variant="plain"
          className={cn({
            "bg-black-6": !isAIThumbnail,
          })}
          onClick={() => setisAIThumbnail(false)}
        >
          Upload Custom Image
        </Button>
      </div>
      {isAIThumbnail ? (
        <div className="flex flex-col gap-5">
          <div className="mt-5 flex flex-col gap-2.5">
            <Label className="text-16 font-bold text-white-1">
              AI Prompt to generate Thumbnail
            </Label>
            <Textarea
              className="input-class font-light focus-visible:ring-offset-orange-1"
              placeholder="Provide text to generate thumbnail"
              rows={5}
              onChange={(e) => setImagePrompt(e.target.value)}
              value={imagePrompt}
            />
          </div>
          <div className="mt-5 w-full max-w-[200px]">
            <Button
              className="text-16 bg-orange-1 py-4 font-bold text-white-1"
              type="button"
              disabled={!imagePrompt || isImgLoading}
              onClick={() => generateImage()}
            >
              {isImgLoading ? (
                <>
                  Generating
                  <Loader size={20} className="animate-spin ml-2" />
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="image_div" onClick={() => imageRef.current?.click()}>
          <Input
            type="file"
            className="hidden"
            ref={imageRef}
            accept="image/*"
            onChange={(e) => uploadImage(e)}
          />
          {!isImgLoading ? (
            <Image
              src="/icons/upload-image.svg"
              alt="upload"
              width={40}
              height={40}
            />
          ) : (
            <div className="text-16 flex-center font-medium text-white-1">
              Uploading...
              <Loader size={20} className="animate-spin" />
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-12 font-bold text-orange-1">Click to Upload</h2>
            <p className="text-12 font-normal text-gray-1">
              SVG, JPG, or GIF (max. 1080px1080px)
            </p>
          </div>
        </div>
      )}
      {image && (
        <div className="flex-center w-full">
          <Image
            src={image}
            alt="thumbnail"
            width={200}
            height={200}
            className="mt-5"
          />
        </div>
      )}
    </>
  );
};

export default GenerateThumbnail;
