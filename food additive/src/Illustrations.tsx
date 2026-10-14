import React from 'react';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';
export function Mascot({ size = 160 }: { size?: number }) {
 return <Svg width={size} height={size} viewBox="0 0 200 200" accessibilityLabel="분홍 토끼 탐정 모구">
  <Ellipse cx="102" cy="177" rx="58" ry="9" fill="#DBD3CD" opacity=".38" />
  <Path d="M62 91 C39 73 39 20 59 18 C77 16 79 57 82 80 M113 79 C111 43 121 13 137 18 C154 23 147 67 137 90" fill="#F7A8B8" stroke="#483E45" strokeWidth="3" />
  <Path d="M58 64 C51 41 54 30 58 30 M128 63 C130 40 133 30 135 31" stroke="#FFE3EA" strokeWidth="9" strokeLinecap="round" />
  <Path d="M60 132 C54 145 53 166 64 172 C78 179 83 164 86 159 L114 159 C119 176 139 180 144 166 C146 152 140 137 133 130" fill="#F7A8B8" stroke="#483E45" strokeWidth="3" />
  <Path d="M52 109 C49 87 65 72 98 72 C130 70 151 84 150 110 C151 140 129 151 100 151 C69 151 52 137 52 109Z" fill="#F7A8B8" stroke="#483E45" strokeWidth="3" />
  <Ellipse cx="70" cy="120" rx="10" ry="6" fill="#EC7F99" /><Ellipse cx="128" cy="120" rx="10" ry="6" fill="#EC7F99" />
  <Circle cx="82" cy="107" r="3.5" fill="#483E45" /><Circle cx="118" cy="107" r="3.5" fill="#483E45" />
  <Path d="M95 116 Q100 120 105 116 M100 120 L100 124 Q93 131 88 124 M100 124 Q107 131 112 124" fill="none" stroke="#483E45" strokeWidth="2.5" strokeLinecap="round" />
  <Path d="M72 143 L100 152 L124 143 L124 158 L101 164 L74 157Z" fill="#568A70" /><Circle cx="101" cy="158" r="3" fill="#FFE7A1" />
  <Path d="M53 136 Q35 134 39 149 Q43 160 61 150" fill="#F7A8B8" stroke="#483E45" strokeWidth="3" />
  <Path d="M143 127 L162 149" stroke="#483E45" strokeWidth="7" strokeLinecap="round" /><Circle cx="140" cy="122" r="20" fill="#E5F3E9" fillOpacity=".9" stroke="#483E45" strokeWidth="5" />
  <Path d="M130 115 Q136 108 143 109" stroke="white" strokeWidth="4" strokeLinecap="round" />
  <Path d="M22 81 L24 73 L27 81 L35 84 L27 87 L24 95 L22 87 L14 84Z" fill="#E6AE49" /><Path d="M169 56 L171 49 L174 56 L181 59 L174 62 L171 69 L169 62 L162 59Z" fill="#568A70" />
 </Svg>;
}
export type IconName = 'search' | 'home' | 'book' | 'heart' | 'info' | 'arrow' | 'back' | 'close' | 'leaf' | 'external' | 'edit';
export function Icon({ name, size = 24, color = '#665560' }: { name: IconName; size?: number; color?: string }) {
 const paths: Record<IconName, string> = {
  search: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Zm5-1.5L21 21', home: 'M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9', book: 'M12 6C9 3 5 3 2 4v16c4-1 7-1 10 2 3-3 6-3 10-2V4c-3-1-7-1-10 2Zm0 0v16',
  heart: 'M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 6l-1-1.2a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z', info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-12v7M12 6h.01', arrow: 'M4 12h16m-6-6 6 6-6 6', back: 'M20 12H4m6-6-6 6 6 6', close: 'm6 6 12 12M6 18 18 6', leaf: 'M20 3C7 2 3 6 4 14c1 7 10 8 14 2 3-4 2-9 2-13ZM4 21 16 8', external: 'M14 3h7v7m0-7L10 14M10 3H3v18h18v-7', edit: 'm15 4 5 5M4 20l5-1L21 7l-4-4L5 15l-1 5Z',
 };
 return <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden><Path d={paths[name]} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>;
}
