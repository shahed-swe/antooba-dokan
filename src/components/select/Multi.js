import React from 'react'
import Select from 'react-select'

const Multi = (props) => {
    const handleSelect = event => props.values(event)

    return (
        <div>
            <Select
                isMulti
                ref={props.refs}
                styles={customStyles}
                options={props.options || null}
                onChange={handleSelect}
                classNamePrefix="custom-select"
                placeholder={`Select ${props.placeholder}`}
                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                defaultValue={props.deafult ? props.deafult.map(item => ({ value: item._id, label: item.name })) : null}
            />
        </div>
    );
};

export default Multi;
const customStyles = {
    control: (provided, state) => ({
        ...provided,
        minHeight: 42,
        fontSize: 14,
        color: '#000',
        boxShadow: 'none', '&:hover': { borderColor: '1px solid #ced4da' },
        border: state.isFocused ? '1px solid #dfdfdf' : '1px solid #ced4da',
        borderRadius: 4
    })
}
