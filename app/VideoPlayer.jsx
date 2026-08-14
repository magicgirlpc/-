"use client";

import { useEffect, useRef, useState } from "react";
import ElasticSlider from "./ElasticSlider";

export default function VideoPlayer({ src, poster }) {
  const videoRef = useRef(null); const [volume, setVolume] = useState(35);
  useEffect(() => { if (videoRef.current) videoRef.current.volume = volume / 100; }, [volume]);
  return <div className="video-player"><video ref={videoRef} controls playsInline poster={poster}><source src={src} type="video/mp4" /></video><div className="video-volume"><span>VOLUME</span><ElasticSlider defaultValue={volume} maxValue={100} stepSize={5} isStepped onChange={setVolume} leftIcon={<span aria-label="减小音量">−</span>} rightIcon={<span aria-label="增大音量">＋</span>} /></div></div>;
}
