import { FileVideo, Upload } from "lucide-react";
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { api } from "@/lib/axios";

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success';


const statusMessages = {
  converting: 'Convertendo....',
  generating: 'Transcrevendo...',
  uploading: 'Carregando....',
  success: 'Sucesso!!',
}

interface VideoInputFormProps {
  onVideoUploaded: (id: string) => void
}

export function VideoInputForm(props: VideoInputFormProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('waiting')

  const promptInputRef = useRef<HTMLTextAreaElement>(null)

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>){
    const { files } = event.currentTarget

    if (!files) {
      return
    }

    const selectedFile = files[0];
    setVideoFile(selectedFile)
  }

  async function convertVideoToAudio(video: File) {
    console.log('Convert started.');

    const ffmpeg = await getFFmpeg();

    await ffmpeg.writeFile('input.mp4', await fetchFile(video))

    ffmpeg.on('log', log => {
      console.log(log);
      
    })

    ffmpeg.on('progress', progress => {
      console.log('Convert progress: ' + Math.round(progress.progress * 100));
    })
    
    ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3'
    ])

    const data = await ffmpeg.readFile('output.mp3');

    const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })
    const audioFile = new File([audioFileBlob], 'audio.mp3', { type: 'audio/mpeg' } )

    console.log('Convert finished.');

    return audioFile;
    
  }

  async function handleUpLoadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const prompt = promptInputRef.current?.value

    if (!videoFile) {
      return
    }

    setStatus('converting');

    // Converter o video em audio
    const audioFile = await convertVideoToAudio(videoFile)
     
    console.log(audioFile, prompt);

    // no backend a rota de upload de arquivos recebe o tipo de arquivo 'form-data', NÃO é um json
    const data = new FormData()

    data.append('file', audioFile)

    setStatus('uploading');

    // faz o upload para o backend
    const response = await api.post('/videos', data)

    const videoId = response.data.video.id


    setStatus('generating');

    // Gera a transcrição
    await api.post(`/videos/${videoId}/transcription`, {
      prompt,
    })

    setStatus('success');
    console.log('finalizou');

    props.onVideoUploaded(videoId)
  }

  const previewURL = useMemo(() => {
    if (!videoFile){
      return undefined
    }

    // o método createObjectURL cria uma preview de um arquivo(img, video, etc...)
    return URL.createObjectURL(videoFile)

  }, [videoFile])

  return (
    <form onSubmit={handleUpLoadVideo} className="space-y-6">
      <label 
      htmlFor="video"
      className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
      >
        {
          videoFile ? (
            <video src={previewURL} controls={false} className="pointer-events-none absolute inset-0" />
          ) : (
            <>
              <FileVideo className="w-4 h4" />
              Carregar video...
            </>
          )
        }

      </label>

      <input type="file" id="video" accept="video/mp4" className="sr-only" onChange={handleFileSelected} />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de Transcrição</Label>
        <Textarea 
          ref={promptInputRef}
          disabled={status !== 'waiting'}
          id="transcription_point"
          className="h-30 leading-relaxed"
          placeholder="Inclua palavras-chave mencionandas no vídeo separadas por vírgula(,)"
        />
      </div>

      <Button 
        disabled={status !== 'waiting'} 
        className="w-full data-[success=true]:bg-emerald-400"
        type="submit"
        data-success={status === 'success'}
      >
          {
            status === 'waiting' ? (
              <>
              Carregar video
              <Upload className="w-4 h4 ml-2" />
              </>
            ) : statusMessages[status]
          }
      </Button>
    </form>
  )
}