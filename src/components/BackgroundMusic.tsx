import React, { useEffect, useState, useRef } from "react"
import "../App.css"

interface MediaItem {
  url: string
  type: "image" | "video"
  plays: number
}

const mediaItems: MediaItem[] = [
  { url: "/Cajpture.PNG", type: "image", plays: 0 },
  { url: "/Capfgture.PNG", type: "image", plays: 0 },
  { url: "/Captucre.PNG", type: "image", plays: 0 },
  { url: "/test.mp4", type: "video", plays: 0 },
]

const MediaGallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentItem = mediaItems[currentIndex]

  useEffect(() => {
    // Simulate loading (replace with your actual loading logic)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    const allItemsPlayedThreeTimes = mediaItems.every((item) => item.plays >= 3)

    if (isPlaying && !isLoading && !allItemsPlayedThreeTimes) {
      intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          let nextIndex = (prevIndex + 1) % mediaItems.length
          let nextItem = mediaItems[nextIndex]

          while (nextItem.plays >= 3) {
            nextIndex = (nextIndex + 1) % mediaItems.length
            nextItem = mediaItems[nextIndex]
          }

          return nextIndex
        })
        mediaItems[currentIndex].plays++
      }, 3000)
    } else {
      setIsPlaying(false)
    }

    return () => clearInterval(intervalId)
  }, [isPlaying, isLoading, mediaItems])

  useEffect(() => {
    if (isPlaying && !isLoading && currentItem) {
      if (currentItem.type === "video" && videoRef.current) {
        videoRef.current.play().catch((error) => {
          if (error.name === "AbortError") {
            console.warn("Video playback aborted:", error)
          } else {
            console.error("Error playing video:", error)
          }
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

  const handlePlayClick = () => {
    setIsPlaying(true)
  }

  return (
    <div className='MediaGallery'>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {!isPlaying && (
            <button onClick={handlePlayClick}>Start Gallery</button>
          )}

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

          <audio ref={audioRef} loop>
            <source src='/AUD-20240313-WA0004.mp3' type='audio/mpeg' />
            Your browser does not support the audio element.
          </audio>
        </>
      )}
    </div>
  )
}

export default MediaGallery
