import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom';
import { backend_url, currency } from '../../App';

const Item = (props) => {
  return (
    <div className='item'>
      <Link to={`/product/${props.id}`}><img onClick={window.scrollTo(0, 0)} src={`${backend_url}${props.image}`} alt={props.name} /></Link>
      <p>{props.name}</p>
      <div className="item-prices">
        <div className="item-price-new">{props.price ? `${currency}${props.price}` : "N/A"}</div>
      </div>
    </div>
  );
};

export default Item;