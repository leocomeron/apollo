interface StarIconProps {
  filled?: boolean;
  half?: boolean;
  size?: number;
}

const StarIcon: React.FC<StarIconProps> = ({ filled, half, size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? '#FFC107' : half ? 'url(#half)' : '#E0E0E0'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="half" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="50%" stopColor="#FFC107" />
        <stop offset="50%" stopColor="#E0E0E0" />
      </linearGradient>
    </defs>
    <path d="M12 17.27L18.18 21L15.64 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L8.36 13.97L5.82 21L12 17.27Z" />
  </svg>
);

export default StarIcon;
