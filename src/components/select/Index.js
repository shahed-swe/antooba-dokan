import React from 'react'
import Select, { components } from 'react-select'
import AsyncSelect from 'react-select/async'
import Creatable from 'react-select/creatable'

const customStyles = (radius) => {

    const myStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: 42,
            fontSize: 14,
            color: '#000',
            background: '#fff',
            boxShadow: 'none', '&:hover': { borderColor: '1px solid #ced4da' },
            border: state.isFocused ? '1px solid #dfdfdf' : '1px solid #ced4da',
            borderRadius: radius || 4
        })
    }
    return myStyles
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

// Single select
export const SingleSelect = (props) => {
    const handleSelect = event => !event ? props.value("") : props.value(event) 

    return (
        <div>
            <Select
                ref={props.refs}
                styles={props.error ? errorStyle : customStyles(props.borderRadius)}
                options={props.options}
                onChange={handleSelect}
                classNamePrefix="custom-select"
                placeholder={`Select ${props.placeholder}`}
                isClearable={props.isClearable}
                clear={props.clear}
                components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null
                }}
                defaultValue={props.deafult ? { ...props.deafult } : null}
            />
        </div>
    );
};

// Creatable Select

export const CreatableSelect = (props) => {
    const handleSelect = event => props.value(event)

    return (
        <div>
            <Creatable
                classNamePrefix="custom-select"
                isMulti
                styles={props.error ? errorStyle : customStyles(props.borderRadius)}
                placeholder={props.placeholder}
                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                onChange={handleSelect}
                defaultValue={props.deafult ? props.deafult.map(item => ({ value: item.value, label: item.label })) : null}
            />
        </div>
    );
};

// Multi Select
export const MultiSelect = (props) => {
    const handleSelect = event => props.values(event)

    return (
        <div>
            <Select
                isMulti
                ref={props.refs}
                styles={customStyles()}
                options={props.options || null}
                onChange={handleSelect}
                classNamePrefix="custom-select"
                placeholder={`Select ${props.placeholder}`}
                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                defaultValue={props.default && props.default.length ? props.default.map(item => ({ ...item })) : null}
            />
        </div>
    );
};

// Searcable select
export const SearchableSelect = (props) => {
    const { Option } = components
    const styles = {
        control: (provided, state) => ({
            ...provided,
            ...props.styles,
            minHeight: 42,
            fontSize: 14,
            color: '#000',
            background: '#fff',
            boxShadow: 'none', '&:hover': { borderColor: '1px solid #ced4da' },
            border: state.isFocused ? '1px solid #dfdfdf' : '1px solid #ced4da',
            borderRadius: props.borderRadius || 25,
            paddingLeft: 5,
            paddingRight: 5,
            marginBottom: "30px"
        })
    }

    // Add image in each option
    const Imageoption = (props) => (
        <Option {...props}>
            {props.data.image ? <img src={props.data.image} style={{ width: 30, height: 30, marginRight: 5 }} alt="..." /> : null}
            {props.data.label}
        </Option>
    );

    // Search from API
    const searchOptions = (inputValue, callback) => {
        props.search(inputValue).then(results => {
            if (results) {
                setTimeout(() => {
                    callback(results)
                }, 500)
            }
        })
    }

    // Handle select
    const handleSelect = event => props.values(event)

    return (
        <div>
            <AsyncSelect
                ref={props.refs}
                cacheOptions
                styles={styles}
                isMulti={props.isMulti}
                onChange={handleSelect}
                isClearable={props.isClearable}
                loadOptions={searchOptions}
                placeholder={props.placeholder}
                loadingMessage={() => 'Searching ...'}
                noOptionsMessage={() => 'No results found !'}
                defaultValue={props.defaultValue ? { ...props.defaultValue } : null}
                components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                    Option: Imageoption
                }}
            />
        </div>
    )
}