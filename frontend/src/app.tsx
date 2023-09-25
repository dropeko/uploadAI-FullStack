import { Separator } from "./components/ui/separator"
import { Button } from "./components/ui/button"
import { Textarea } from "./components/ui/textarea"
import { Label } from "./components/ui/label"
import { Slider } from "./components/ui/slider"
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "./components/ui/select"
import { Github, Wand2, Computer } from 'lucide-react'
import { VideoInputForm } from "./components/video-input-form.tsx"
import { PrompSelect } from "./components/prompt-select.tsx"
import { useState } from "react"
import { useCompletion } from 'ai/react'

function App() {
  const [temperature, setTemperature] = useState(0.5)
  const [videoId, setVideoId] = useState<string | null>(null)


    const {
      input,
      setInput,
      handleInputChange,
      handleSubmit,
      completion,
      isLoading,
    } = useCompletion({
      api: 'http://localhost:3333/ai/complete',
      body: {
        videoId,
        temperature,
      },
      headers: {
        'Content-type': 'application/json'
      },
    })


  return (
    <div className="min-h-screen flex flex-col" >

      <header className="px-6 py-3 flex items-center justify-between border-b">

      <h1 className="text-xl font-bold flex items-center">
          <Computer 
            className="w-4 h-4 mr-2"
          />
          PHCA.dev
        </h1>

        <h1 className="text-xl font-bold">Upload.ai</h1>
    
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Desenvolvido com 💛 por PHCA.dev 
          </span>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="secondary">
            <Github className="w-4 h-4 mr-2" />
            GitHub
          </Button>
        </div>
      
      </header>
      
      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
              <Textarea
                className="resize-none p-5 leading-relaxed"  
                placeholder="Inclua o prompt para a IA..."
                value={input}
                onChange={handleInputChange}
              />

              <Textarea
                className="resize-none p-5 leading-relaxed"  
                placeholder="Resultado gerado pela IA:" 
                readOnly
                value={completion}
              />
          </div>
          <p className="text-sm text-muted-foreground">
            Lembre-se: Você pode utilizar a variavel <code className="text-violet-400">{'{transcription}'}</code> no seu prompt para adicionar o conteudo da transcrição do video selecionado
          </p>
        </div>

        <aside className="w-80 space-y-6">

          <VideoInputForm
            onVideoUploaded={setVideoId}
          />

          <Separator />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label>Prompt</Label>

                <PrompSelect onPromptSelected={setInput} />

              </div>

              <div className="space-y-2">
                <Label>Modelo</Label>
                <Select disabled defaultValue="gpt3.5">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                  </SelectContent>
                </Select>
                <span className="block text-xs text-muted-foreground italic">Você poderá costumizar essa opção em breve.</span>
              </div>

              <Separator />

              <div className="space-y-2">
                <Slider 
                  min={0}
                  max={1}
                  step={0.05}
                  value={[temperature]}
                  onValueChange={value => setTemperature(value[0])}
                />

                <span className="block text-xs text-muted-foreground italic">
                  Valores mais altos tendem a deixar o resultado mais criativo e com mais erros
                </span>
              </div>

              <Separator />

              <Button disabled={isLoading} type="submit" className="w-full">
                Executar
                <Wand2 className="w-4 ml-2" />
              </Button>
          </form>

        </aside>

      </main>

    </div>
  )
}

export default App
