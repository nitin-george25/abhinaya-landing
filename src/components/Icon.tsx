import {
  Instagram, Facebook, Youtube, Menu, X, Ticket, Play, ArrowRight,
  Bell, MapPin, Clock, Check, Mail, Phone, Loader, type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";

// Map the legacy lowercase icon names to lucide-react components.
const ICONS: Record<string, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  menu: Menu,
  x: X,
  ticket: Ticket,
  play: Play,
  "arrow-right": ArrowRight,
  bell: Bell,
  "map-pin": MapPin,
  clock: Clock,
  check: Check,
  mail: Mail,
  phone: Phone,
  loader: Loader,
};

export default function Icon({
  name,
  size = 20,
  stroke = 2,
  style,
}: {
  name: string;
  size?: number;
  stroke?: number;
  style?: CSSProperties;
}) {
  const Cmp = ICONS[name] || X;
  return (
    <span style={{ display: "inline-flex", width: size, height: size, ...style }}>
      <Cmp size={size} strokeWidth={stroke} />
    </span>
  );
}
