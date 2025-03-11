import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../API/BaseURL";

const Subproduct = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [newSubproduct, setNewSubproduct] = useState({
    name: "",
    price: "",
    productId: "",
    size: "",
    color: "",
    height: "",
    width: ""
  });

  // Fetch products when search term changes
  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setProducts([]);
      return;
    }

    axios
      .get(`${BASE_URL}/api/product/search?name=${searchTerm}`)
      .then((response) => {
        setProducts(response.data.products || []);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]);
      });
  }, [searchTerm]);

  // Handle product selection
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setNewSubproduct({
      name: product.productName,
      price: product.price,
      productId: product._id,
      size: "",
      color: "",
      height: "",
      width: ""
    });

    setSearchTerm(product.productName);
  };

  // Handle input change
  const handleChange = (e) => {
    setNewSubproduct({ ...newSubproduct, [e.target.name]: e.target.value });
  };

  // Add subproduct
  const handleAddSubproduct = () => {
    if (!selectedProduct) {
      alert("Please select a product before adding a subproduct.");
      return;
    }

    setLoading(true);
    setMessage("");

    axios
      .post(`${BASE_URL}/api/subproduct/add`, newSubproduct)
      .then(() => {
        setMessage("✅ Subproduct added successfully!");
        setNewSubproduct({
          name: "",
          price: "",
          productId: "",
          size: "",
          color: "",
          height: "",
          width: ""
        });
        setSearchTerm("");
        setSelectedProduct(null);
      })
      .catch((error) => {
        setMessage("❌ Error adding subproduct! Try again.");
        console.error("Error adding subproduct:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add Subproduct</h2>

      {/* Success/Error Message */}
      {message && <div style={styles.message}>{message}</div>}

      {/* Search Input */}
      <input
        type="text"
        placeholder="Enter Product Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.input}
      />

      {/* Product Table */}
      {products.length > 0 && (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price (₹)</th>
                <th>Product Code</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.productName}</td>
                  <td>{product.price}</td>
                  <td>{product.productCode}</td>
                  <td>
                    <button style={styles.selectButton} onClick={() => handleSelectProduct(product)}>
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Selected Product */}
      {selectedProduct && (
        <div style={styles.selectedProduct}>
          <strong>Selected:</strong> {selectedProduct.productName} - ₹{selectedProduct.price} ({selectedProduct.productCode})
        </div>
      )}

      {/* Subproduct Form */}
      <div style={{ ...styles.form, marginTop: products.length > 0 ? "20px" : "0px" }}>
        <input
          type="text"
          name="name"
          placeholder="Subproduct Name"
          value={newSubproduct.name || ""}
          onChange={handleChange}
          style={styles.input}
          readOnly
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newSubproduct.price || ""}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="text"
          name="size"
          placeholder="Size (optional)"
          value={newSubproduct.size || ""}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="text"
          name="color"
          placeholder="Color (optional)"
          value={newSubproduct.color || ""}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="number"
          name="height"
          placeholder="Height (optional)"
          value={newSubproduct.height || ""}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="number"
          name="width"
          placeholder="Width (optional)"
          value={newSubproduct.width || ""}
          onChange={handleChange}
          style={styles.input}
        />
        <button onClick={handleAddSubproduct} style={styles.button} disabled={loading}>
          {loading ? "Adding..." : "Add Subproduct"}
        </button>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingTop: "80px",
    marginTop: "-90px",
  },
  heading: {
    color: "#7C444F",
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  message: {
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    backgroundColor: "#F39E60",
    color: "#fff",
    fontSize: "14px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #9F5255",
    borderRadius: "5px",
    outline: "none",
    width: "250px",
    marginBottom: "10px",
  },
  tableContainer: {
    width: "80%",
    overflowX: "auto",
    marginTop: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "16px",
    textAlign: "left",
  },
  selectButton: {
    padding: "5px 10px",
    backgroundColor: "#E16A54",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s",
  },
  selectedProduct: {
    background: "#F39E60",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "10px",
    color: "#fff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    width: "300px",
    transition: "margin-top 0.3s ease-in-out",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#7C444F",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s",
  },
};

export default Subproduct;
