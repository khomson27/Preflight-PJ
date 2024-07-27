import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DueDateSelector.css'

interface DueDateSelectorProps {
    dueDate: Date | null;
    setDueDate: (date: Date | null) => void;
}

const DueDateSelector: React.FC<DueDateSelectorProps> = ({ dueDate, setDueDate }) => {
    return (
        <div>
            {/* <label htmlFor="dueDate">Due Date: </label> */}
            <DatePicker
                selected={dueDate}
                onChange={(date: Date | null) => setDueDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select a due date"
                className="custom-datepicker"
            />
        </div>
    );
};

export default DueDateSelector;
