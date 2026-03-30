"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedRobotProps {
  className?: string; // For adding external tailsind positioning
  size?: number; // Size in pixels
}

export function AnimatedRobot({ className, size = 180 }: AnimatedRobotProps) {
  // Base chassis width is 170px
  const baseSize = 170;
  const scale = size / baseSize;
  const hideShadow = size < 50;
  
  // Height calculation: Chassis is 170. Shadow margin is 35, shadow height is 15.
  // Total height = 170 + 35 + 15 = 220.
  const containerHeight = (hideShadow ? 170 : 220) * scale;

  return (
    <div 
      className={cn("relative flex-shrink-0 flex items-center justify-center", className)}
      style={{ 
        width: size, 
        height: containerHeight,
      }}
    >
      <div 
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: hideShadow ? "center center" : "top center",
          width: '170px',
          height: hideShadow ? '170px' : '220px'
        }} 
        className={cn(
          hideShadow ? "relative" : "absolute top-0",
          "flex flex-col items-center"
        )}
      >
        <style dangerouslySetInnerHTML={{__html: `
          :root {
            --light-bot-cyan: #00ffff;
            --light-bot-panel: #ffffff; 
          }

          .light-bot-robot-group {
            position: relative;
            /* Center the float animation vertically to avoid severe uncentering */
            animation: light-bot-master-float 4.5s ease-in-out infinite; 
          }

          @keyframes light-bot-master-float {
            0%, 100% { transform: translateY(10px) rotate(0.5deg); }
            50% { transform: translateY(-20px) rotate(-0.5deg); }
          }

          .light-bot-chassis {
            width: 170px; 
            height: 170px;
            background: var(--light-bot-panel);
            border-radius: 85px; 
            position: relative;
            border: 3px solid rgba(255,255,255,1);
            box-shadow: 
              inset 0 10px 30px rgba(0,0,0,0.03), 
              0 15px 40px rgba(0,0,0,0.06); 
            overflow: hidden;
            z-index: 2;
          }

          .light-bot-visor {
            position: absolute;
            top: 50%; 
            left: 15px;
            width: 140px;
            height: 70px;
            transform: translateY(-50%);
            background: #000;
            border-radius: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1.5px solid rgba(0, 255, 255, 0.3);
          }

          .light-bot-eye-container {
            display: flex;
            gap: 30px; 
          }

          .light-bot-eye {
            width: 32px;
            height: 16px;
            background: var(--light-bot-cyan); 
            border-radius: 20px 20px 0 0;
            box-shadow: 0 0 15px var(--light-bot-cyan); 
            animation: light-bot-blink 4.5s infinite;
          }

          @keyframes light-bot-blink {
            0%, 90%, 100% { transform: scaleY(1); opacity: 1; }
            93%, 95% { transform: scaleY(0.1); opacity: 0.3; }
          }

          .light-bot-shadow {
            width: 140px;
            height: 15px;
            background: rgba(0, 255, 255, 0.05);
            border-radius: 50%;
            filter: blur(12px);
            margin-top: 35px;
            animation: light-bot-shadow-scale 4.5s ease-in-out infinite;
          }

          @keyframes light-bot-shadow-scale {
            0%, 100% { transform: scale(1.3); opacity: 0.3; }
            50% { transform: scale(0.6); opacity: 0.1; }
          }
        `}} />
        
        <div className="light-bot-robot-group">
          <div className="light-bot-chassis">
            <div className="light-bot-visor">
              <div className="light-bot-eye-container">
                <div className="light-bot-eye"></div>
                <div className="light-bot-eye"></div>
              </div>
            </div>
          </div>
        </div>
        {!hideShadow && <div className="light-bot-shadow"></div>}
      </div>
    </div>
  );
}
