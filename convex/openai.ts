import { v } from "convex/values";
import OpenAI from "openai";
import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";
import { action } from "./_generated/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateAudioAction = action({
  args: { input: v.string(), voiceType: v.string() },
  handler: async (_, { input, voiceType }) => {
    // const textResponse = await openai.completions.create({
    //   model: "davinci-002",
    //   prompt: "Generate an interesting podcast transcript for the topic using the following prompt: " + input,
    //   stream: false,
    // });
    // if (!textResponse.choices[0].text) {
    //   throw new Error("Error generating audio");
    // }

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voiceType as SpeechCreateParams["voice"],
      input, // textResponse.choices[0].text,
    });
    return await mp3.arrayBuffer();
  },
});

export const generateThumbnailAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });
    const url = response.data[0].url;
    if (!url) {
      throw new Error("Error generating image");
    }
    const imageResponse = await fetch(url);
    return await imageResponse.arrayBuffer();
  },
});
