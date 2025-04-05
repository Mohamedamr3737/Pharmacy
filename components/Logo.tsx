import Link from "next/link"

export default function Logo({ size = "default" }: { size?: "small" | "default" | "large" }) {
  const dimensions = {
    small: { width: 120, height: 40 },
    default: { width: 150, height: 50 },
    large: { width: 200, height: 67 },
  }

  const { width, height } = dimensions[size]

  return (
    <Link href="/" className="flex items-center">
      <div className="relative" style={{ width, height }}>
        <svg width={width} height={height} viewBox="0 0 150 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20 10H40C45.523 10 50 14.477 50 20V30C50 35.523 45.523 40 40 40H20C14.477 40 10 35.523 10 30V20C10 14.477 14.477 10 20 10Z"
            fill="#0D9488"
          />
          <path d="M25 15L35 25M35 15L25 25" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path d="M60 15H70M60 25H75M60 35H72" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M80 15H90M85 15V35M95 15H105M95 25H105M95 35H105"
            stroke="#0D9488"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M110 15H120M110 25H120M110 35H120" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M125 15H135M125 15V35M125 35H135"
            stroke="#0D9488"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M140 15V35M140 15H150M140 25H148M140 35H150"
            stroke="#0D9488"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  )
}

