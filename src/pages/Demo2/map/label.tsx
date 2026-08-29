import { Html } from "@react-three/drei";
import styled, { keyframes } from "styled-components";
import { useConfigStore } from "../stores";
import type { ComponentProps } from "react";

// 少数民族语言列表（使用实际存在的音频文件）
const minorityLangs = [
  { lang: "buyei", name: "布依语", file: "buyei_03.mp3" },
  { lang: "dong", name: "侗语", file: "dong_03.mp3" },
];

// 当前播放的音频对象（全局唯一，防止同时播放）
let currentAudio: HTMLAudioElement | null = null;
let isPlaying = false;
let playSequence: 'minority' | 'chinese' = 'minority'; // 播放顺序：先少数民族，再中文

// 语音播报函数（播放预生成的音频）
const speakWarning = (cityName: string, useMandarin: boolean, onEnd?: () => void) => {
  console.log('speakWarning called:', { cityName, useMandarin });

  // 如果正在播放，等待后再试
  if (isPlaying || currentAudio) {
    console.log('Already playing, waiting...');
    setTimeout(() => speakWarning(cityName, useMandarin, onEnd), 500);
    return;
  }

  isPlaying = true;

  // 根据播放顺序决定语言
  let audioPath: string;
  let isChinese: boolean;

  if (playSequence === 'minority') {
    // 播放少数民族语言（随机选择布依语或侗语）
    const randomLang = minorityLangs[Math.floor(Math.random() * minorityLangs.length)];
    audioPath = `${import.meta.env.BASE_URL}audio/${randomLang.file}`;
    isChinese = false;
    playSequence = 'chinese'; // 下一次播放中文
  } else {
    // 播放中文（随机选择1或2）
    const numStr = (Math.floor(Math.random() * 2) + 1).toString();
    audioPath = `${import.meta.env.BASE_URL}audio/zhw${numStr}.mp3`;
    isChinese = true;
    playSequence = 'minority'; // 下一次播放少数民族语言
  }

  console.log(`Playing: ${audioPath} (${isChinese ? '中文' : '少数民族语言'})`);

  const audio = new Audio(audioPath);
  audio.volume = 1.0;

  audio.onplay = () => console.log('Audio started:', audioPath);
  audio.onended = () => {
    console.log('Audio ended');
    currentAudio = null;
    isPlaying = false;
    if (onEnd) onEnd();
  };
  audio.onerror = (e) => {
    console.error('Audio error:', e);
    currentAudio = null;
    isPlaying = false;
    if (onEnd) onEnd();
  };

  audio.play().catch(err => {
    console.error('Play failed:', err);
    currentAudio = null;
    isPlaying = false;
    if (onEnd) onEnd();
  });

  currentAudio = audio;
};

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.15); opacity: 1; }
`;

const soundWave = keyframes`
  0% { transform: scale(0.5); opacity: 1; }
  100% { transform: scale(2.5); opacity: 0; }
`;

const Label = styled(Html)`
  pointer-events: none;
  width: max-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ffffff;
`;

const IconWrapper = styled.div<{ $glow: string }>`
  position: relative;
  width: 30px;
  height: 30px;
  animation: ${pulse} 2s ease-in-out infinite;
  filter: drop-shadow(0 0 8px ${props => props.$glow});

  svg {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 2;
  }
`;

const SoundWave = styled.div<{ $color: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin-top: -10px;
  margin-left: -10px;
  border-radius: 50%;
  border: 2px solid ${props => props.$color}99;
  animation: ${soundWave} 1.5s ease-out infinite;
  z-index: 1;

  &:nth-child(2) {
    animation-delay: 0.5s;
  }

  &:nth-child(3) {
    animation-delay: 1s;
  }
`;

const Name = styled.div`
  font-size: 10px;
  margin-top: 2px;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
  white-space: nowrap;
`;

// 城市颜色配置
const cityColors: Record<string, { main: string; dark: string; glow: string }> = {
  "贵阳市": { main: "#FF4444", dark: "#CC0000", glow: "rgba(255, 68, 68, 0.8)" },      // 红色
  "遵义市": { main: "#FF8C00", dark: "#CC7000", glow: "rgba(255, 140, 0, 0.8)" },      // 橙色
  "六盘水市": { main: "#4488FF", dark: "#2266CC", glow: "rgba(68, 136, 255, 0.8)" },    // 蓝色
  "安顺市": { main: "#FFD700", dark: "#CCAA00", glow: "rgba(255, 215, 0, 0.8)" },      // 黄色
  "毕节市": { main: "#FF4444", dark: "#CC0000", glow: "rgba(255, 68, 68, 0.8)" },      // 红色
  "铜仁市": { main: "#FF8C00", dark: "#CC7000", glow: "rgba(255, 140, 0, 0.8)" },      // 橙色
  "黔东南苗族侗族自治州": { main: "#4488FF", dark: "#2266CC", glow: "rgba(68, 136, 255, 0.8)" },  // 蓝色
  "黔南布依族苗族自治州": { main: "#FFD700", dark: "#CCAA00", glow: "rgba(255, 215, 0, 0.8)" },    // 黄色
  "黔西南布依族苗族自治州": { main: "#FF4444", dark: "#CC0000", glow: "rgba(255, 68, 68, 0.8)" },  // 红色
};

const getCityColor = (cityName: string) => {
  return cityColors[cityName] || { main: "#FF8C00", dark: "#CC7000", glow: "rgba(255, 140, 0, 0.8)" };
};

const SpeakerIcon = ({ cityName }: { cityName: string }) => {
  const colors = getCityColor(cityName);

  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`speaker-${cityName}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.main} />
          <stop offset="100%" stopColor={colors.dark} />
        </linearGradient>
        <filter id="shadow3d">
          <feDropShadow dx="1" dy="2" stdDeviation="1" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* Speaker body */}
      <path
        d="M4 12V20H8L14 26V6L8 12H4Z"
        fill={`url(#speaker-${cityName})`}
        stroke={colors.dark}
        strokeWidth="1"
        filter="url(#shadow3d)"
      />
      {/* Highlight for 3D effect */}
      <path
        d="M5 13V17H7L8 16V12L5 13Z"
        fill="rgba(255, 255, 255, 0.3)"
      />
      {/* Sound wave 1 */}
      <path
        d="M17 11C17 11 19 12.5 19 16C19 19.5 17 21 17 21"
        stroke={colors.main}
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#shadow3d)"
      />
      {/* Sound wave 2 */}
      <path
        d="M20 8C20 8 23 10.5 23 16C23 21.5 20 24 20 24"
        stroke={colors.main}
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#shadow3d)"
      />
      {/* Sound wave 3 */}
      <path
        d="M23 5C23 5 27 8.5 27 16C27 23.5 23 27 23 27"
        stroke={colors.main}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
        filter="url(#shadow3d)"
      />
    </svg>
  );
};

// 导出播报函数供外部使用
export { speakWarning };

export default function Index({
  children,
  ...props
}: ComponentProps<typeof Label>) {
  const mapPlayComplete = useConfigStore((s) => s.mapPlayComplete);
  const activeSpeakerCity = useConfigStore((s) => s.activeSpeakerCity);

  const isActive = activeSpeakerCity === children;
  const colors = getCityColor(children as string);

  return mapPlayComplete ? (
    <Label {...props}>
      {isActive && (
        <IconWrapper $glow={colors.glow}>
          <SoundWave $color={colors.main} />
          <SoundWave $color={colors.main} />
          <SoundWave $color={colors.main} />
          <SpeakerIcon cityName={children as string} />
        </IconWrapper>
      )}
      <Name>{children}</Name>
    </Label>
  ) : null;
}
