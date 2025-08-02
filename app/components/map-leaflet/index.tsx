'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import styles from './index.module.css'

// 修复 Leaflet 默认图标问题
const fixLeafletIcon = () => {
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    })
}

// 自定义图标类
class CustomIcon extends L.Icon {
    constructor(options: L.IconOptions) {
        super(options)
    }
}

interface MapProps {
    center?: [number, number]
    zoom?: number
    markers?: Array<{
        position: [number, number]
        title: string
        description?: string
        icon?: {
            url?: string
            size?: [number, number]
            anchor?: [number, number]
            popupAnchor?: [number, number]
            className?: string
        }
    }>
    className?: string
    style?: React.CSSProperties
}

export default function MapLeaflet({
    center = [22.5329, 113.9305], // 默认深圳
    zoom = 13,
    markers = [],
    className = "",
    style = {}
}: MapProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<L.Map | null>(null)

    useEffect(() => {
        fixLeafletIcon()

        if (mapRef.current && !mapInstanceRef.current) {
            // 创建地图实例
            const map = L.map(mapRef.current, {
                zoomControl: false,
                attributionControl: false,
            }).setView(center, zoom)
            mapInstanceRef.current = map

            // 添加瓦片图层（替换这段）
            L.tileLayer('https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png', {
                attribution: ''
            }).addTo(map)



            // 创建自定义图标
            const customIcon = new CustomIcon({
                iconUrl: '/images/custom-marker.webp', // 你可以替换为你的图标路径
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32],
                className: styles['custom-marker-icon']
            })

            // 添加默认的深圳标记点
            L.marker(center, { icon: customIcon }).addTo(map);

            // 添加自定义标记点
            markers.forEach(marker => {
                let markerIcon = customIcon

                // 如果标记有自定义图标配置
                if (marker.icon) {
                    markerIcon = new CustomIcon({
                        iconUrl: marker.icon.url || '/images/custom-marker.webp',
                        iconSize: marker.icon.size || [32, 32],
                        iconAnchor: marker.icon.anchor || [16, 32],
                        popupAnchor: marker.icon.popupAnchor || [0, -32],
                        className: marker.icon.className || styles['custom-marker-icon']
                    })
                }

                const leafletMarker = L.marker(marker.position, { icon: markerIcon }).addTo(map)
                if (marker.description) {
                    leafletMarker.bindPopup(`
            <div>
              <h3 style="font-weight: 600; font-size: 1.125rem; margin-bottom: 0.25rem;">${marker.title}</h3>
              <p style="color: #6b7280; margin-top: 0.25rem;">${marker.description}</p>
            </div>
          `)
                } else {
                    leafletMarker.bindPopup(`<h3 style="font-weight: 600;">${marker.title}</h3>`)
                }
            })
        }

        // 清理函数
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
        }
    }, [center, zoom, markers])

    return (
        <div
            ref={mapRef}
            className={`w-full ${className}`}
            style={style}
        />
    )
} 