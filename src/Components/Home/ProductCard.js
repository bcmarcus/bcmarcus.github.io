import React from 'react';
import { Link } from 'react-router-dom';
import '/src/Assets/Home/home.css';

const ProductCard = ({ product }) => {
  return (
      <div className="product-card">
        <Link key={product.id} to={`/products/\${product.id}`}>
          <div
            className="product-image"
            style={{ backgroundImage: `url(\${product.image})` }}
          ></div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price}</p>
        <p className="product-description">{product.description}</p>
      </Link>
    </div>
  );
};

export default ProductCard;