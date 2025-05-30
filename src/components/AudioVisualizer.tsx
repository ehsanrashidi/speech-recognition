import React, { useEffect, useRef } from "react";
import { AudioVisualizerProps } from "../types";

interface AudioVisualizerExtendedProps extends AudioVisualizerProps {
    status?: string;
}

const AudioVisualizer: React.FC<AudioVisualizerExtendedProps> = ({ isActive, audioLevel = 0.5, status }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const barsRef = useRef<number[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resizeCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);

            // Recalculate bars when canvas is resized
            const barWidth = 4;
            const barSpacing = 6;
            const barCount = Math.floor(rect.width / (barWidth + barSpacing));
            barsRef.current = Array(barCount)
                .fill(0)
                .map(() => Math.random() * 0.2);
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        const animate = () => {
            const rect = canvas.getBoundingClientRect();
            ctx.clearRect(0, 0, rect.width, rect.height);

            if (!isActive || status === "idle") {
                drawIdleState(ctx, rect.width, rect.height);
                animationRef.current = requestAnimationFrame(animate);
                return;
            }

            const barWidth = 4;
            const barSpacing = 6;
            const maxBarHeight = rect.height * 0.8;

            barsRef.current.forEach((bar, i) => {
                const positionFactor = 1 - Math.abs((i / barsRef.current.length) * 2 - 1) * 0.7;
                const targetHeight = audioLevel * maxBarHeight * positionFactor;

                // Smooth transition with easing
                barsRef.current[i] = bar + (targetHeight - bar) * 0.15;

                // Add subtle randomness
                barsRef.current[i] += (Math.random() * 0.1 - 0.05) * audioLevel;
                barsRef.current[i] = Math.max(0, Math.min(maxBarHeight, barsRef.current[i]));

                const x = i * (barWidth + barSpacing) + barSpacing;
                const height = barsRef.current[i];
                const y = (rect.height - height) / 2;

                // Create gradient
                const gradient = ctx.createLinearGradient(0, y, 0, y + height);
                gradient.addColorStop(0, "rgba(230, 194, 41, 0.9)");
                gradient.addColorStop(1, "rgba(10, 35, 66, 0.95)");

                ctx.beginPath();
                ctx.roundRect(x, y, barWidth, height, barWidth / 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isActive, audioLevel, status]);

    const drawIdleState = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const centerY = height / 2;
        const lineWidth = width * 0.8;
        const startX = (width - lineWidth) / 2;
        const endX = startX + lineWidth;

        ctx.beginPath();
        ctx.moveTo(startX, centerY);
        ctx.lineTo(endX, centerY);
        ctx.strokeStyle = "rgba(100, 116, 139, 0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();
    };

    return (
        <div className="w-full relative">
            <canvas
                ref={canvasRef}
                className="w-full h-24 rounded-xl"
                style={{
                    transition: "opacity 0.3s ease",
                    opacity: isActive && status !== "idle" ? 1 : 0.5,
                }}
            />
        </div>
    );
};

export default AudioVisualizer;
