"use client"
import { Experience } from "@/components/Disha/Experience"
import { UI } from "@/components/Disha/UI"
import { ChatProvider } from "@/hooks/useChat"
import { Loader } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Leva } from "leva"
import "./style.css"
function App() {
  return (
    <ChatProvider>
      <Loader />
      <Leva hidden />
      <UI />
      <Canvas
        className="three-canvas bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat"
        shadows
        camera={{ position: [0, 0, 1], fov: 30 }}
        style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" }}
      >
        <Experience />
      </Canvas>
    </ChatProvider>
  )
}

export default App

