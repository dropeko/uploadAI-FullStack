import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { createReadStream } from "node:fs";
import { streamToResponse, OpenAIStream } from 'ai'
import { z } from "zod";
import { openai } from "../lib/openai";


export async function generateAICompletionRoute(app: FastifyInstance) {
app.post('/ai/complete', async (requisition, response) => {

  const bodySchema = z.object({
    prompt: z.string(),
    videoId: z.string().uuid(),
    temperature: z.number().min(0).max(1).default(0.5)
  })

  const { videoId, prompt, temperature } = bodySchema.parse(requisition.body)

  const video = await prisma.video.findUniqueOrThrow({
    where: {
      id: videoId,
    }
  })

  if (!video.transcription) {
    return response.status(400).send({ error: 'Video transcription was not generated yet'})
  }

  const promptMessage = prompt.replace('{transcription}', video.transcription)

  const responseChat = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    temperature,
    messages: [
      { 
        role: 'user',
        content: promptMessage,
      }
    ],
    stream: true,

  })

  const stream = OpenAIStream(responseChat)

  streamToResponse(stream, response.raw, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    },
  })

})
}