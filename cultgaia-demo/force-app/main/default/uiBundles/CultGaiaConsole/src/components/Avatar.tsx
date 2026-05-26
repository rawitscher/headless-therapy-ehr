type Props = {
  firstName: string;
  lastName: string;
  hue?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

const SIZES = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-2xl',
} as const;

export default function Avatar({ firstName, lastName, hue = 28, size = 'md' }: Props) {
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
  return (
    <div
      className={`${SIZES[size]} rounded-full flex items-center justify-center font-semibold tracking-wide select-none`}
      style={{
        background: `hsl(${hue} 40% 92%)`,
        color: `hsl(${hue} 45% 26%)`,
        border: `1px solid hsl(${hue} 30% 82%)`,
      }}
    >
      {initials}
    </div>
  );
}
