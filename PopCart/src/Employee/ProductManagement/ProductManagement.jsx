import React from "react";
import "./ProductManagement.css";


export default function ProductManagement() {
const products = Array(5).fill({
album: "Thriller",
artist: "Michael Jackson",
genre: "Pop",
price: "$24.99",
stock: 45,
year: 1982,
img: "https://via.placeholder.com/50"
});


return (
<div className="container">
<h1>Product Management</h1>
<p>Manage album inventory and details</p>


<div className="top-bar">
<input className="search" placeholder="Search by title or artist..." />
<select className="select">
<option>All Genres</option>
</select>
<button className="add-btn">+ Add Product</button>
</div>


<table>
<thead>
<tr>
<th>Album</th>
<th>Artist</th>
<th>Genre</th>
<th>Price</th>
<th>Stock</th>
<th>Year</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
{products.map((p, i) => (
<tr key={i}>
<td className="album-cell">
<img src={p.img} alt="album" />
<span>{p.album}</span>
</td>
<td>{p.artist}</td>
<td><span className="genre-tag">{p.genre}</span></td>
<td>{p.price}</td>
<td><input className="stock-input" defaultValue={p.stock} /></td>
<td>{p.year}</td>
<td className="actions">
<span className="edit"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.75 1.41422H2.08333C1.72971 1.41422 1.39057 1.55469 1.14052 1.80474C0.890476 2.05479 0.75 2.39393 0.75 2.74755V12.0809C0.75 12.4345 0.890476 12.7736 1.14052 13.0237C1.39057 13.2737 1.72971 13.4142 2.08333 13.4142H11.4167C11.7703 13.4142 12.1094 13.2737 12.3595 13.0237C12.6095 12.7736 12.75 12.4345 12.75 12.0809V7.41422" stroke="#2B7FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.9999 1.16421C11.2651 0.898997 11.6248 0.75 11.9999 0.75C12.375 0.75 12.7347 0.898997 12.9999 1.16421C13.2651 1.42943 13.4141 1.78914 13.4141 2.16421C13.4141 2.53929 13.2651 2.899 12.9999 3.16421L6.99123 9.17355C6.83293 9.33171 6.63737 9.44749 6.42257 9.51021L4.50723 10.0702C4.44987 10.0869 4.38906 10.0879 4.33117 10.0731C4.27329 10.0583 4.22045 10.0282 4.1782 9.98592C4.13594 9.94366 4.10583 9.89083 4.091 9.83294C4.07617 9.77505 4.07717 9.71425 4.0939 9.65688L4.6539 7.74155C4.71692 7.52691 4.83292 7.33159 4.99123 7.17355L10.9999 1.16421Z" stroke="#2B7FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</span>
<span className="delete"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_312_2564)">
<path d="M10.6667 11.3333V15.3333" stroke="#E7000B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.3333 11.3333V15.3333" stroke="#E7000B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.6666 8V17.3333C16.6666 17.687 16.5261 18.0261 16.2761 18.2761C16.026 18.5262 15.6869 18.6667 15.3333 18.6667H8.66659C8.31296 18.6667 7.97382 18.5262 7.72378 18.2761C7.47373 18.0261 7.33325 17.687 7.33325 17.3333V8" stroke="#E7000B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 8H18" stroke="#E7000B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.33325 8.00001V6.66668C9.33325 6.31305 9.47373 5.97392 9.72378 5.72387C9.97383 5.47382 10.313 5.33334 10.6666 5.33334H13.3333C13.6869 5.33334 14.026 5.47382 14.2761 5.72387C14.5261 5.97392 14.6666 6.31305 14.6666 6.66668V8.00001" stroke="#E7000B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_312_2564">
<rect width="16" height="16" fill="white" transform="translate(4 4)"/>
</clipPath>
</defs>
</svg>
</span>
</td>
</tr>
))}
</tbody>
</table>
</div>
);
}