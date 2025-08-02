'use client'

interface SvgTextProps {
    text: string;
    fontSize?: number;
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    padding?: number;
}

export default function SvgText({
    text,
    fontSize = 100,
    fillColor = "#000",
    strokeColor = "#fff",
    strokeWidth = 6,
    padding = 20
}: SvgTextProps) {
    // 估算文字宽度（基于字符数和字体大小）
    const estimatedWidth = Math.max(text.length * fontSize * 0.6, 300)
    const estimatedHeight = fontSize * 1.2

    return (
        <svg
            width="100%"
            height={estimatedHeight}
            viewBox={`0 0 ${estimatedWidth} ${estimatedHeight}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ 
                maxWidth: '100vw', 
                overflow: 'visible',
                minWidth: `${Math.min(estimatedWidth, 800)}px`
            }}
        >
            <defs>
                <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="6" dy="6" stdDeviation="6" flood-color="rgba(0,0,0,0.3)" />
                    <feDropShadow dx="8" dy="8" stdDeviation="12" flood-color="rgba(0,0,0,0.2)" />
                </filter>
            </defs>

            {/* 第一层：白色描边（更粗，只有描边，无填充） */}
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={fontSize}
                fontFamily="Noto Sans, sans-serif"
                fontWeight="bold"
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth * 2}
                strokeLinejoin="round"
                strokeLinecap="round"
                filter="url(#shadow)"
            >
                {text}
            </text>

            {/* 第二层：黑色文字（覆盖在描边上） */}
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={fontSize}
                fontFamily="Noto Sans, sans-serif"
                fontWeight="bold"
                fill={fillColor}
                stroke="none"
            >
                {text}
            </text>
        </svg>
    )
} 