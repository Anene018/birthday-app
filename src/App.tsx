import React from "react"
import "./App.css"
import Header from "./components/Header"
import Footer from "./components/Footer"
import MediaGallery from "./components/MediaGallery"

const App: React.FC = () => {
  return (
    <div className='App'>
      <Header />
      <MediaGallery />
      <Footer />
      {/* <BackgroundMusic /> */}
    </div>
  )
}

export default App
