import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { fastifyMultipart } from "@fastify/multipart";
import path from "node:path";
import { randomUUID } from "node:crypto";
import fs from 'node:fs';
import { pipeline } from "node:stream";
import { promisify } from "node:util";

const pump = promisify(pipeline)

export async function uploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1048575 * 25 // 25mb
    }
  })
  // Rota responsavel por listar todos os prompts que tenho cadastrado
  app.post('/videos', async (requisition, response) => {
    const data = await requisition.file()

    if (!data) {
      return response.status(400).send({ error: 'Missing file input' })
    }

    const extensionFile = path.extname(data.filename)

    if (extensionFile !== '.mp3') {
      return response.status(400).send({ error: 'Invalid input type, please upload a MP3' })
    }

    const fileBaseName = path.basename(data.filename, extensionFile)
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extensionFile}`
    const uploadPath = path.resolve(__dirname, '../../tmp', fileUploadName)

    await pump(data.file, fs.createWriteStream(uploadPath))

    // Depois de terminar o upload do arquivo, é preciso criar o registro na tabela do BD
    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadPath,
      }
    })

    return {
      video,
    }

  })
  }