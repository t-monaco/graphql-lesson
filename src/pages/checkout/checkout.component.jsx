import React from 'react';

import {default as CheckoutItem} from '../../components/checkout-item/checkout-item.container';
import StripeCheckoutButton from '../../components/stripe-button/stripe-button.component';

import './checkout.styles.scss';

const CheckoutPage = ({ cartItems, cartTotal }) => (
    <div className='checkout-page'>
        <div className='checkout-header'>
            <div className='header-block'>
                <span>Product</span>
            </div>
            <div className='header-block'>
                <span>Description</span>
            </div>
            <div className='header-block'>
                <span>Quantity</span>
            </div>
            <div className='header-block'>
                <span>Price</span>
            </div>
            <div className='header-block'>
                <span>Remove</span>
            </div>
        </div>
        {cartItems.map((cartItem) => (
            <CheckoutItem key={cartItem.id} cartItem={cartItem} />
        ))}
        <div className='cartT'>TOTAL: ${cartTotal}</div>
        <div className='test-warning'>
            <strong>*Please use the following credit card for payments*</strong>
            <br />
            4242 4242 4242 4242 - Exp: 01/
            {(new Date().getFullYear() + 1).toString().substr(-2)} - CVV 123
        </div>
        <StripeCheckoutButton price={cartTotal} />
    </div>
);

export default CheckoutPage;
