import React, { useEffect, useState, useRef } from "react"
import "../App.css"

interface MediaItem {
  url: string
  type: "image" | "video"
}

const mediaItems: MediaItem[] = [
  { url: "/Cajpture.PNG", type: "image" },
  { url: "/Capfgture.PNG", type: "image" },
  { url: "/Captucre.PNG", type: "image" },
  { url: "/test.mp4", type: "video" },
]

const MediaGallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentItem = mediaItems[currentIndex]

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(loadingTimeout)
  }, [])

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isPlaying && !isLoading && !hasAutoPlayed) {
      intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % mediaItems.length
          if (nextIndex === 0) {
            clearInterval(intervalId)
            setIsPlaying(false)
            setHasAutoPlayed(true)
          }
          return nextIndex
        })
      }, 3000)
    }

    return () => clearInterval(intervalId)
  }, [isPlaying, isLoading, hasAutoPlayed])

  useEffect(() => {
    if (isPlaying && !isLoading && currentItem) {
      if (currentItem.type === "video" && videoRef.current) {
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error)
        })
      } else if (audioRef.current) {
        audioRef.current.play()
      }
    } else {
      videoRef.current?.pause()
      audioRef.current?.pause()
    }
  }, [isPlaying, isLoading, currentItem])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.1
    }
  }, [])

  const handleButtonClick = () => {
    if (hasAutoPlayed && !isPlaying) {
      setHasAutoPlayed(false)
      setCurrentIndex(0)
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className='MediaGallery'>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <button onClick={handleButtonClick} className='btn'>
            {isPlaying ? "Stop Gallery" : "Start Gallery"}
          </button>

          {currentItem.type === "image" ? (
            <img
              src={currentItem.url}
              alt={`Slide ${currentIndex + 1}`}
              className='slide-media'
            />
          ) : (
            <video ref={videoRef} controls className='slide-media'>
              <source src={currentItem.url} type='video/mp4' />
              Your browser does not support the video tag.
            </video>
          )}

          <audio ref={audioRef}>
            <source src='/AUD-20240313-WA0004.mp3' type='audio/mpeg' />
            Your browser does not support the audio element.
          </audio>
        </>
      )}
    </div>
  )
}

export default MediaGallery
