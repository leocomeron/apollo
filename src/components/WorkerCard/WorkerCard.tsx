import React from 'react';
import StarIcon from '../icons/StarIcon';

interface WorkerCardProps {
  firstName: string;
  lastName: string;
  profession: string;
  age: number;
  rating: number;
}

const WorkerCard: React.FC<WorkerCardProps> = ({
  firstName,
  lastName,
  profession,
  age,
  rating,
}) => {
  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6 m-3">
      <div className="flex flex-col items-center">
        <img
          className="w-24 h-24 rounded-full object-cover mb-4"
          src="https://via.placeholder.com/150"
          alt={`${firstName} ${lastName}`}
        />
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {firstName} {lastName}
          </h2>
          <p className="text-gray-600">
            {profession} - {age} años
          </p>
          <div className="flex justify-center mt-2">
            {Array(5)
              .fill('')
              .map((_, i) => (
                <StarIcon key={i} filled={i < rating} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerCard;
