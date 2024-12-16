import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface MapModalProps {
  isOpen: boolean
  onClose: () => void
  lat: number
  lng: number
  title: string
}

export function MapModal({ isOpen, onClose, lat, lng, title }: MapModalProps) {
  // OpenStreetMap URL - free, no API key needed
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="h-[400px] w-full">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            src={mapUrl}
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}