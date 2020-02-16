import React from 'react';
import ReactDOM from 'react-dom';
import Form from './Form';

export default (): void => {
    ReactDOM.render(<Form/>, document.getElementById('orderFormRoot'));
};
