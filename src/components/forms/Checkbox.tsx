import { CheckboxProps } from '@/types';

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label = '',
  checked,
  disabled,
  onChange,
  color = '#81a240', // Default color
  labelColor = '#6b7280', // Default label color
  size = '18px', // Default size
}) => {
  const handleChange = () => {
    if (onChange) {
      onChange(id);
    }
  };

  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'start',
        cursor: disabled ? 'not-allowed' : 'pointer',
        flexWrap: 'wrap',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        style={{
          width: size,
          height: size,
          accentColor: color,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      />
      {label && (
        <span
          style={{ marginLeft: '12px', color: labelColor, fontSize: '14px' }}
        >
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;
