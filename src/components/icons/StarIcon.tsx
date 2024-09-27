interface StarIconProps {
  filled: boolean;
}

const StarIcon = ({ filled, half }: { filled?: boolean; half?: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 20 20"
    fill={filled ? '#FFC107' : half ? 'url(#half)' : '#E0E0E0'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="half" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="50%" stopColor="#FFC107" />
        <stop offset="50%" stopColor="#E0E0E0" />
      </linearGradient>
    </defs>
    <path d="M12 2.5l2.47 5.16L20 8.37l-4 3.89.94 5.46L12 15.94l-4.94 2.78.94-5.46-4-3.89 5.53-.71L12 2.5z" />
  </svg>
);

export default StarIcon;
