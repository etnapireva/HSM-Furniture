import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom';
import { currency } from '../../config';
import ProductImage from '../ProductImage';

const Item = (props) => {
  return (
    <div className='item'>
      <Link to={`/product/${props.id}`} onClick={() => window.scrollTo(0, 0)}>
        <ProductImage image={props.image} images={props.images} alt={props.name} />
      </Link>
      <p>{props.name}</p>
      <div className="item-prices">
        <div className="item-price-new">{props.price ? `${props.price} ${currency}` : "N/A"}</div>
      </div>
    </div>
  );
};

export default Item;