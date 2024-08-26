import React from 'react';
import { Image } from 'react-bootstrap';

const Header = () => {
    return (
        <div className='row'>
            <div className="col-4">
                <Image src="/public/images/logo.svc" alt="logo" />
            </div>
        </div>
    );
};

export default Header;