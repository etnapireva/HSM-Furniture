import React, { useEffect, useState } from "react";
import "./CSS/ShopCategory.css";
import Item from "../Components/Item/Item";
import { backend_url } from "../App";

const ShopCategory = ({ banner, category }) => {
  const [all, setAll] = useState([]);

  useEffect(() => {
    fetch(`${backend_url}/allproducts`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched products in ShopCategory:", data); // Debug
        setAll(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, [backend_url]);

  return (
    <div className="shopcategory">
      <img src={banner} className="shopcategory-banner" alt="" />
      <div className="shopcategory-products">
        {all
          .filter((p) => p.category === category)
          .map((p) => (
            <Item
              key={p.id}
              id={p.id}
              name={p.name}
              image={p.image}
              price={p.price} // Kalon price nga produkti
            />
          ))}
      </div>
    </div>
  );
};

export default ShopCategory;