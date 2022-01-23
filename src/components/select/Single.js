import React from 'react'
import Select from 'react-select'
import { useTranslation } from 'react-i18next';

const SingleSelect = (props) => {
    const handleSelect = event => props.value(event)
    const { t } = useTranslation();
    return (
        <div>
            <Select
                styles={props.error ? errorStyle : customStyles}
                options={props.options}
                onChange={handleSelect}
                classNamePrefix="custom-select"
                placeholder={t(`Select ${props.placeholder}`)}
                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                defaultValue={props.default ? { ...props.default } : null}
            />
        </div>
    );
};

export default SingleSelect;
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

const errorStyle = {
    control: (provided) => ({
        ...provided,
        minHeight: 42,
        fontSize: 14,
        color: '#000',
        boxShadow: 'none', '&:hover': { borderColor: '1px solid #ced4da' },
        border: '1px solid red',
        borderRadius: 4
    })
}