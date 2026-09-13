import React, { useContext, useEffect, useState } from "react";
import Breadcrums from "../Components/Breadcrums/Breadcrums";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import DescriptionBox from "../Components/DescriptionBox/DescriptionBox";
import Reviews from "../Components/Reviews/Reviews";
import RelatedProducts from "../Components/RelatedProducts/RelatedProducts";
import RecentlyViewed from "../Components/RecentlyViewed/RecentlyViewed";
import { useParams } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { backend_url } from "../config";
import { cartKey } from "../config";

const Product = () => {
  const { products } = useContext(ShopContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findProduct = async () => {
      setLoading(true);
      
      // First, try to find in context products
      if (products.length > 0) {
        const found = products.find(
          (e) => String(e._id) === productId || String(e.id) === productId
        );
        
        if (found) {
          setProduct(found);
          setLoading(false);
          return;
        }
      }
      
      // If not found in context, try direct API call
      try {
        const response = await fetch(`${backend_url}/product/${productId}`);
        if (response.ok) {
          const productData = await response.json();
          setProduct(productData);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      }
      setLoading(false);
    };

    findProduct();
  }, [products, productId]);

  if (loading) {
    return (
      <div style={{ 
        padding: 20, 
        textAlign: 'center',
        fontSize: '18px',
        color: '#666',
        marginTop: '50px'
      }}>
        Loading…
      </div>
    );
  }

  if (product === null) {
    return (
      <div style={{ 
        padding: 20, 
        textAlign: 'center', 
        fontSize: '18px',
        color: '#666',
        marginTop: '50px'
      }}>
        Produkt nuk u gjet.
        <br />
        <small style={{ fontSize: '14px', marginTop: '10px', display: 'block' }}>
          ID: {productId}
        </small>
      </div>
    );
  }

  return (
    <div>
      <ProductDisplay product={product} />
      <Breadcrums product={product} />
      <DescriptionBox product={product} />
      <Reviews productId={productId} />
      <RelatedProducts category={product.category} id={cartKey(product)} />
      <RecentlyViewed excludeId={cartKey(product)} />
    </div>
  );
};

export default Product;
