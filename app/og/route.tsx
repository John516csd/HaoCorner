import { ImageResponse } from 'next/og'

export function GET(request: Request) {
  let url = new URL(request.url)
  let title = url.searchParams.get('title') || "Yanchenhao's Corner"

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full items-center justify-center bg-[#faf9f6]">
        <div tw="absolute inset-0 flex">
          <div tw="w-full h-full bg-[#faf9f6]" />
        </div>
        <div tw="flex flex-col w-[920px] items-center justify-center bg-white px-16 py-12 border-4 border-[#d1d5db] rounded-3xl shadow-xl">
          <div tw="text-3xl text-[#64748b] mb-4">Frontend Engineer · Digital Scrapbook</div>
          <h1 tw="text-7xl font-bold tracking-tight text-center text-[#1f2937]">
            {title}
          </h1>
          <div tw="text-4xl text-[#64748b] mt-6">yanchenhao.com</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
