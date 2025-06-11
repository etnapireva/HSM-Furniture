import React, { useContext, useEffect, useState } from "react";
import Breadcrums from "../Components/Breadcrums/Breadcrums";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import DescriptionBox from "../Components/DescriptionBox/DescriptionBox";
import { useParams } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";

const Product = () => {
  const { products } = useContext(ShopContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (products.length > 0) {
const found = products.find(
  (e) => String(e._id) === productId || String(e.id) === productId
);
      setProduct(found || null);
    }
  }, [products, productId]);

  if (product === null) {
    return <div style={{ padding: 20 }}>Produkt nuk u gjet.</div>;
  }
  if (!product) {
    return <div style={{ padding: 20 }}>Loading…</div>;
  }

  return (
    <div>
      <ProductDisplay product={product} />
      <Breadcrums product={product} />
      <DescriptionBox product={product} />
    </div>
  );
};

export default Product;
