import React from 'react';
import Select from 'react-select';

const customStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: '10px',
    borderColor: 'blue',
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'blue',
    },
  }),
  menu: (provided) => ({
    ...provided,
    width: '230px',
    borderRadius: '10px',
  }),
  option: (provided, state) => ({
    ...provided,
    width: '210px',
    height: '66px',
    padding: '24px 0 24px 16px',
    backgroundColor: '#EDEDED',
    borderBottom: '1px solid #CDD3DD',
    color: state.isSelected ? 'white' : 'black',
    '&:hover': {
      backgroundColor: '#EDEDED',
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    width: '220px',
    height: '66px',
    padding: '24px 0 24px 16px',
    color: 'grey',
fontFamily: 'Nunito',
fontSize: '18px',
fontWeight: '600',

  }),
};


const DropdownComponent = ({ value, onChange, options }) => {
  return (
    <Select
      styles={customStyles}
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Выберите категорию"
      isSearchable={false} // установлено в false, если поиск не нужен
    />
  );
};

export default DropdownComponent;
