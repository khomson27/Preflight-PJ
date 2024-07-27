// src/Dropdown.tsx
import React from 'react';
import './Tag.css';
type Option = {
    value: string;
    label: string;
};

interface DropdownProps {
    options: Option[];
    selectedValue: string;
    onChange: (value: string) => void;
}

const Tag: React.FC<DropdownProps> = ({ options, selectedValue, onChange }) => {
    // const [selectedValue, setSelectedValue] = useState<string>('');

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        // setSelectedValue(value);
        onChange(value);
    };

    return (
        <select className='custom-dropdown' value={selectedValue} onChange={handleChange}>
            <option value="" disabled>
                Select Tag
            </option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default Tag;
