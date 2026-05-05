import {
  SquaresFour,
  Warehouse,
  Users,
  Package,
  ArrowsInLineHorizontal,
  Barcode,
  PlusCircle,
  Printer,
  Plus,
  Truck,
  Cube,
  CheckCircle,
  Globe,
  ShoppingCart,
  Handshake
} from "@phosphor-icons/react";

interface IconProps {
  className?: string;
}

export const Icons = {
  Area: ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16v16H4z" />
    </svg>
  ),
  Warehouse: ({ className }: IconProps) => <Warehouse size={32} weight="duotone" className={className} />,
  Team: ({ className }: IconProps) => <Users size={32} weight="duotone" className={className} />,
  Package: ({ className }: IconProps) => <Package size={32} weight="duotone" className={className} />,
  Shrink: ({ className }: IconProps) => <ArrowsInLineHorizontal size={32} weight="duotone" className={className} />,
  Mark: ({ className }: IconProps) => <Barcode size={32} weight="duotone" className={className} />,
  Insert: ({ className }: IconProps) => <Plus size={32} weight="duotone" className={className} />,
  Additional: ({ className }: IconProps) => <PlusCircle size={32} weight="duotone" className={className} />,
  Print: ({ className }: IconProps) => <Printer size={32} weight="duotone" className={className} />,
  ArrowUp: ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  ),
  Truck: ({ className }: IconProps) => <Truck size={32} weight="duotone" className={className} />,
  Cube: ({ className }: IconProps) => <Cube size={32} weight="duotone" className={className} />,
  CheckCircle: ({ className }: IconProps) => <CheckCircle size={32} weight="duotone" className={className} />,
  Globe: ({ className }: IconProps) => <Globe size={32} weight="duotone" className={className} />,
  ShoppingCart: ({ className }: IconProps) => <ShoppingCart size={32} weight="duotone" className={className} />,
  Handshake: ({ className }: IconProps) => <Handshake size={32} weight="duotone" className={className} />,
}; 