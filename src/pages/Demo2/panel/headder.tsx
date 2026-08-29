import type { ComponentProps } from "react";
import styled from "styled-components";

const TitleWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 85px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
`;

export default function Headder(props: ComponentProps<typeof TitleWrapper>) {
  return (
    <TitleWrapper {...props}>
      <svg width="100%" height="100%" viewBox="0 0 1920 85" preserveAspectRatio="none">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <text x="960" y="55" fill="#4A90FF" fontSize="38" fontFamily="Microsoft YaHei, SimHei, sans-serif" fontWeight="600" textAnchor="middle" letterSpacing="8" filter="url(#glow)">贵州省应急广播Agent</text>
      </svg>
    </TitleWrapper>
  );
}
