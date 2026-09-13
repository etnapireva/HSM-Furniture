import React, { useEffect, useState } from 'react'
import './RelatedProducts.css'
import Item from '../Item/Item'
import { backend_url } from '../../config';
import { cartKey } from '../../config';

const RelatedProducts = ({ category, id }) => {
  const [related, setRelated] = useState([]);
  const currentId = id != null ? String(id) : '';

  useEffect(() => {
    if (!category) {
      setRelated([]);
      return;
    }

    fetch(`${backend_url}/relatedproducts`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category }),
    })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.products || []);
        setRelated(list.filter((item) => cartKey(item) !== currentId).slice(0, 8));
      })
      .catch((err) => {
        console.error('Related products error:', err);
        setRelated([]);
      });
  }, [category, currentId]);

  if (!related.length) return null;

  return (
    <div className="relatedproducts">
      <h1>Produkte të ngjashme</h1>
      <hr />
      <div className="relatedproducts-item">
        {related.map((item) => {
          const itemId = cartKey(item);
          return (
            <Item
              key={itemId}
              id={itemId}
              name={item.name}
              image={item.image}
              images={item.images}
              price={item.price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts
