type AmbientVariant = 'soft-stars' | 'soft-aurora' | 'diagonal-dust' | 'corner-glow'

type AmbientLayerProps = {
  variant?: AmbientVariant
}

export function AmbientLayer({ variant = 'soft-stars' }: AmbientLayerProps) {
  return <div className={`ambient-layer ambient-layer--${variant}`} />
}
