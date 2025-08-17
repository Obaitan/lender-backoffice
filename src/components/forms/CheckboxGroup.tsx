import { useState } from 'react';
import Checkbox from './Checkbox';

interface CheckboxOption {
  id: string;
  label: string;
}

interface CheckboxGroupProps {
  options: CheckboxOption[];
  color?: string;
  labelColor?: string;
  size?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  color,
  labelColor,
  size,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleChange = (id: string) => {
    setSelectedId(id);
  };

  return (
    <>
      {options.map((option) => (
        <Checkbox
          key={option.id}
          id={option.id}
          label={option.label}
          checked={selectedId === option.id}
          onChange={handleChange}
          color={color}
          labelColor={labelColor}
          size={size}
        />
      ))}
    </>
  );
};

export default CheckboxGroup;
