import React, { useState } from 'react';
import api from '../api'; // Jo api.js humne banaya tha

const AddProduct = () => {
  // Form States
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Yeh raha wo logic jo aapne pucha tha
  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Step 1: Image upload logic (Matches main.py: @app.post("/admin/upload-image"))
    const imageFormData = new FormData();
    imageFormData.append('file', selectedFile); 

    try {
      // Pehle image upload karke Supabase URL mangwayein
      const uploadRes = await api.post('/admin/upload-image', imageFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const imageUrl = uploadRes.data.url; 

      // Step 2: Product create logic (Matches admin.py: @router.post("/products"))
      const productData = {
        name: productName,
        description: description,
        price: parseInt(price) * 100, // Backend expects paise 
        images: [imageUrl],           // backend expects List[str] 
        active: true
      };

      await api.post('/admin/products', productData);
      alert("Product created successfully!");
      
      // Form reset karein
      setProductName('');
      setPrice('');
      setDescription('');
      setSelectedFile(null);
      e.target.reset();

    } catch (err) {
      console.error("Upload failed", err.response?.data || err.message);
      alert("Error: " + (err.response?.data?.detail || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2>Add New Product</h2>
      <form onSubmit={handleUpload} style={styles.form}>
        <input 
          type="text" 
          placeholder="Product Name" 
          value={productName}
          onChange={(e) => setProductName(e.target.value)} 
          required 
          style={styles.input}
        />
        <input 
          type="number" 
          placeholder="Price in Rupees (e.g. 500)" 
          value={price}
          onChange={(e) => setPrice(e.target.value)} 
          required 
          style={styles.input}
        />
        <textarea 
          placeholder="Product Description" 
          value={description}
          onChange={(e) => setDescription(e.target.value)} 
          style={styles.input}
          rows="4"
        />
        <div style={{ margin: '10px 0' }}>
          <label>Product Image: </label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])} 
            required 
          />
        </div>
        <button 
          type="submit" 
          disabled={loading} 
          style={loading ? styles.btnDisabled : styles.btn}
        >
          {loading ? 'Processing...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  card: { background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px' },
  btn: { padding: '12px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  btnDisabled: { padding: '12px', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'not-allowed' }
};

export default AddProduct;