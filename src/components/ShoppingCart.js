import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, clearCart, updateQuantity } from '../redux/cartActions';

const ShoppingCart = () => {
  // Coleta o estado de forma segura
  const cartItems = useSelector((state) => {
    if (state.cartItems && Array.isArray(state.cartItems)) return state.cartItems;
    if (state.cart && Array.isArray(state.cart.cartItems)) return state.cart.cartItems;
    return [];
  });

  const dispatch = useDispatch();
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!itemName || !itemPrice) return alert("Preencha todos os campos antes de continuar.");

    const parsedPrice = parseFloat(itemPrice.replace(',', '.'));
    
    if (isNaN(parsedPrice) || parsedPrice <= 0 || parsedPrice > 999) {
      return alert("Valor inválido. O limite permitido por item é de R$ 999,00.");
    }

    dispatch(addItem({
      id: "PROD_" + Date.now(),
      name: itemName, 
      price: parsedPrice
    }));

    setItemName('');
    setItemPrice('');
  };

  const handleQuantityChange = (id, value) => {
    if (!id) return;
    let qty = parseInt(value, 10);
    
    if (isNaN(qty) || qty < 1) qty = 1;
    if (qty > 100) qty = 100;

    dispatch(updateQuantity(id, qty));
  };

  // Funções para os botões rápidos de [+] e [-] (Recurso 4)
  const incrementQty = (id, currentQty) => {
    const nextQty = (currentQty || 1) + 1;
    if (nextQty <= 100) dispatch(updateQuantity(id, nextQty));
  };

  const decrementQty = (id, currentQty) => {
    const nextQty = (currentQty || 1) - 1;
    if (nextQty >= 1) dispatch(updateQuantity(id, nextQty));
  };

  // Contadores calculados (Recurso 3 e Total)
  const totalUnidades = cartItems.reduce((acc, item) => acc + (item?.quantity || 0), 0);
  
  const totalGeral = cartItems.reduce((acc, item) => {
    const price = item && item.price ? Number(item.price) : 0;
    const quantity = item && item.quantity ? Number(item.quantity) : 1;
    return acc + (price * quantity);
  }, 0);

  const styles = {
    container: { padding: '25px', fontFamily: 'sans-serif', maxWidth: '540px', margin: '30px auto', backgroundColor: '#2b5270', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' },
    titleArea: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '25px' },
    title: { color: '#ffffff', fontSize: '26px', fontWeight: 'bold', margin: 0 },
    badge: { backgroundColor: '#ffc107', color: '#111111', padding: '4px 10px', borderRadius: '50px', fontSize: '14px', fontWeight: 'bold' },
    formInput: { width: '100%', padding: '12px', marginBottom: '12px', backgroundColor: '#ffffff', border: '1px solid #ccc', borderRadius: '6px', boxSizing: 'border-box', fontSize: '15px' },
    btnAdd: { backgroundColor: '#218838', color: 'white', border: 'none', padding: '14px', borderRadius: '6px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', width: '100%', marginBottom: '25px' },
    btnRemove: { backgroundColor: '#e05300', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
    btnClear: { backgroundColor: '#c82333', color: 'white', border: 'none', padding: '14px', borderRadius: '6px', cursor: 'pointer', marginTop: '20px', width: '100%', fontSize: '16px', fontWeight: 'bold' },
    itemList: { listStyle: 'none', padding: 0, margin: '20px 0' },
    itemRow: { padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '10px' },
    qtyContainer: { display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#ced4da', padding: '2px', borderRadius: '6px' },
    qtyBtn: { backgroundColor: '#ffffff', border: 'none', color: '#2b5270', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    qtyInput: { width: '45px', border: 'none', background: 'transparent', textAlign: 'center', fontWeight: 'bold', fontSize: '15px', outline: 'none' }
  };

  return (
    <div style={styles.container}>
      {/* Título com Contador Total de Itens (Recurso 3) */}
      <div style={styles.titleArea}>
        <h1 style={styles.title}>Painel de Vendas</h1>
        {totalUnidades > 0 && <span style={styles.badge}>{totalUnidades}</span>}
      </div>

      <form onSubmit={handleAddItem}>
        <input 
          type="text" 
          placeholder="Nome do Item (Máx 125 caracteres)" 
          maxLength="125"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          style={styles.formInput}
        />
        <input 
          type="number" 
          placeholder="Preço Unitário (Máx R$ 999,00)" 
          step="0.01"
          max="999"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          style={styles.formInput}
        />
        <button type="submit" style={styles.btnAdd}>
          Adicionar ao Estoque Atual
        </button>
      </form>

      <ul style={styles.itemList}>
        {cartItems.map((item, index) => {
          if (!item) return null;

          const itemId = item.id || `fallback-id-${index}`;
          const itemNameDisplay = item.name || "Produto sem nome";
          const itemPriceDisplay = item.price ? Number(item.price).toFixed(2) : "0.00";
          const subtotalDisplay = (Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2);
          const currentQty = item.quantity || 1;

          return (
            <li key={itemId} style={styles.itemRow}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxWidth: '55%' }}>
                <span style={{ color: '#111111', fontWeight: 'bold', fontSize: '1rem', wordBreak: 'break-word' }}>
                  {itemNameDisplay}
                </span>
                <span style={{ color: '#6c757d', fontSize: '0.85rem', fontWeight: '500' }}>
                  Valor: R$ {itemPriceDisplay} | Subtotal: R$ {subtotalDisplay}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Controladores Rápidos de Quantidade (Recurso 4) */}
                <div style={styles.qtyContainer}>
                  <button 
                    type="button" 
                    onClick={() => decrementQty(itemId, currentQty)} 
                    style={styles.qtyBtn}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    min="1" 
                    max="100" 
                    value={currentQty} 
                    onChange={(e) => handleQuantityChange(itemId, e.target.value)}
                    style={styles.qtyInput}
                  />
                  <button 
                    type="button" 
                    onClick={() => incrementQty(itemId, currentQty)} 
                    style={styles.qtyBtn}
                  >
                    +
                  </button>
                </div>

                <button onClick={() => dispatch(removeItem(itemId))} style={styles.btnRemove}>
                  Remover
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {cartItems.length > 0 && (
        <>
          <div style={{ color: '#ffffff', textAlign: 'right', fontWeight: 'bold', fontSize: '20px', marginTop: '15px', borderTop: '2px dashed rgba(255,255,255,0.3)', paddingTop: '15px' }}>
            VALOR TOTAL: R$ {totalGeral.toFixed(2)}
          </div>
          <button onClick={() => dispatch(clearCart())} style={styles.btnClear}>
            Limpar Todos os Registros
          </button>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;