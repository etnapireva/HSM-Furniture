import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../Assets/upload_area.svg";
import { backend_url } from "../../config";
import toast, { Toaster } from 'react-hot-toast';

const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    price: "",
    color: "",
    prodhimi: "",
    material: "",
    size: "",
    collection: "dhomagjumi",
    image: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!productDetails.name || !productDetails.price || !productDetails.collection) {
      toast.error("Please fill in all required fields!", {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#f44336',
          color: '#fff',
        },
        icon: '❌',
      });
      return;
    }

    try {
      let imageUrl = "/images/garniture1.webp"; // Default placeholder - using existing image

      // Upload image if one is selected
      if (image) {
        console.log("=== IMAGE UPLOAD DEBUG ===");
        console.log("Image selected:", image.name, image.type, image.size);
        console.log("Uploading image to:", `${backend_url}/upload`);
        
        const formData = new FormData();
        formData.append('image', image);

        console.log("FormData created, sending upload request...");
        
        try {
          const uploadResponse = await fetch(`${backend_url}/upload`, {
            method: 'POST',
            body: formData,
          });

          console.log("Upload response status:", uploadResponse.status);
          console.log("Upload response ok:", uploadResponse.ok);

          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            console.log("Upload response data:", uploadData);
            imageUrl = uploadData.image_url;
            console.log("Image uploaded successfully, URL:", imageUrl);
          } else {
            const errorText = await uploadResponse.text();
            console.error("Image upload failed. Status:", uploadResponse.status);
            console.error("Error response:", errorText);
            toast.error("Image upload failed, using placeholder image", {
              duration: 4000,
              position: 'top-right',
              style: {
                background: '#f44336',
                color: '#fff',
              },
              icon: '❌',
            });
          }
        } catch (uploadError) {
          console.error("Upload request failed:", uploadError);
          toast.error("Image upload failed, using placeholder image", {
            duration: 4000,
            position: 'top-right',
            style: {
              background: '#f44336',
              color: '#fff',
            },
            icon: '❌',
          });
        }
      } else {
        console.log("No image selected, using default image");
      }

      // Prepare product data with the uploaded image URL
      const productData = {
        ...productDetails,
        image: imageUrl,
        price: Number(productDetails.price)
      };

      // Try to add product directly to MongoDB collection
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`${backend_url}/admin/addproduct`, {
        method: 'POST',
        headers: {
          'auth-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          toast.success("Product Added Successfully!", {
            duration: 4000,
            position: 'top-right',
            style: {
              background: '#4CAF50',
              color: '#fff',
            },
            icon: '✅',
          });
          // Reset form
          setProductDetails({
            name: "",
            price: "",
            color: "",
            prodhimi: "",
            material: "",
            size: "",
            collection: "dhomagjumi",
            image: ""
          });
          setImage(false);
        } else {
          toast.error("Failed to add product: " + (data.error || "Unknown error"), {
            duration: 4000,
            position: 'top-right',
            style: {
              background: '#f44336',
              color: '#fff',
            },
            icon: '❌',
          });
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error("Failed to add product: " + (errorData.error || `HTTP ${response.status}`), {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#f44336',
            color: '#fff',
          },
          icon: '❌',
        });
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product. Please try again.", {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#f44336',
          color: '#fff',
        },
        icon: '❌',
      });
    }
  }

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  }

  return (
    <div className="addproduct">
      <Toaster />
      <div className="addproduct-itemfield">
        <p>Product Name *</p>
        <input 
          type="text" 
          name="name" 
          value={productDetails.name} 
          onChange={changeHandler} 
          placeholder="Enter product name" 
        />
      </div>
      
      <div className="addproduct-itemfield">
        <p>Price (€) *</p>
        <input 
          type="number" 
          name="price" 
          value={productDetails.price} 
          onChange={changeHandler} 
          placeholder="Enter price" 
        />
      </div>

      <div className="addproduct-itemfield">
        <p>Color</p>
        <input 
          type="text" 
          name="color" 
          value={productDetails.color} 
          onChange={changeHandler} 
          placeholder="e.g., Bardhë, Zi, etc." 
        />
      </div>

      <div className="addproduct-itemfield">
        <p>Prodhimi (Production)</p>
        <input 
          type="text" 
          name="prodhimi" 
          value={productDetails.prodhimi} 
          onChange={changeHandler} 
          placeholder="e.g., Shqipëri" 
        />
      </div>

      <div className="addproduct-itemfield">
        <p>Material</p>
        <input 
          type="text" 
          name="material" 
          value={productDetails.material} 
          onChange={changeHandler} 
          placeholder="e.g., Druri, Metal, etc." 
        />
      </div>

      <div className="addproduct-itemfield">
        <p>Size</p>
        <input 
          type="text" 
          name="size" 
          value={productDetails.size} 
          onChange={changeHandler} 
          placeholder="e.g., 200x180cm" 
        />
      </div>

      <div className="addproduct-itemfield">
        <p>Collection *</p>
        <select 
          value={productDetails.collection} 
          name="collection" 
          className="add-product-selector" 
          onChange={changeHandler}
        >
          <option value="dhomagjumi">Dhoma Gjumi</option>
          <option value="garnitura">Garnitura</option>
          <option value="karrika">Karrika</option>
          <option value="kende">Kënde</option>
          <option value="tavolinabuke">Tavolina Buke</option>
          <option value="tavolinamesi">Tavolina Mësi</option>
        </select>
      </div>

      <div className="addproduct-itemfield">
        <p>Product Image</p>
        <label htmlFor="file-input">
          <img 
            className="addproduct-thumbnail-img" 
            src={!image ? upload_area : URL.createObjectURL(image)} 
            alt="" 
          />
        </label>
        <input 
          onChange={(e) => {
            console.log("File input changed:", e.target.files[0]);
            setImage(e.target.files[0]);
          }} 
          type="file" 
          name="image" 
          id="file-input" 
          accept="image/*" 
          hidden 
        />
      </div>

      <button className="addproduct-btn" onClick={handleSubmit}>
        ADD PRODUCT
      </button>
    </div>
  );
};

export default AddProduct;
