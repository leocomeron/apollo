interface StarIconProps {
  filled: boolean;
}

const StarIcon: React.FC<StarIconProps> = ({ filled }) => {
  return (
    <svg
      className={`w-5 h-5 ${filled ? 'text-yellow-500' : 'text-gray-300'}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.3 3.993a1 1 0 00.95.69h4.215c.969 0 1.371 1.24.588 1.81l-3.415 2.5a1 1 0 00-.364 1.118l1.3 3.993c.3.921-.755 1.688-1.54 1.118l-3.415-2.5a1 1 0 00-1.175 0l-3.415 2.5c-.785.57-1.84-.197-1.54-1.118l1.3-3.993a1 1 0 00-.364-1.118l-3.415-2.5c-.783-.57-.381-1.81.588-1.81h4.215a1 1 0 00.95-.69l1.3-3.993z" />
    </svg>
  );
};

export default StarIcon;
