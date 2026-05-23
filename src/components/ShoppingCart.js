import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, clearCart, updateQuantity } from '../redux/cartActions';

const ShoppingCart = () => {
  const cartItems = useSelector((state) => {
    if (state.cartItems && Array.isArray(state.cartItems)) return state.cartItems;
    if (state.cart && Array.isArray(state.cart.cartItems)) return state.cart.cartItems;
    return [];
  });

  const dispatch = useDispatch();
  
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('Salgados');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [activeTab, setActiveTab] = useState('vendas'); 
  const [salesHistory, setSalesHistory] = useState([]);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  
  // Opção 3: Estado para selecionar a forma de pagamento
  const [paymentMethod, setPaymentMethod] = useState('Dinheiro');

  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#0f172a';
    return () => {
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

  useEffect(() => {
    const savedHistory = localStorage.getItem('SALES_HISTORY');
    if (savedHistory) {
      try { setSalesHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
    }
  }, []);

  const showNotification = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3000);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!itemName || !itemPrice) return showNotification("Preencha todos os campos!", "error");

    const parsedPrice = parseFloat(itemPrice.replace(',', '.'));
    if (isNaN(parsedPrice) || parsedPrice <= 0 || parsedPrice > 999) {
      return showNotification("Limite permitido de R$ 0,01 até R$ 999,00.", "error");
    }

    dispatch(addItem({
      id: "PROD_" + Date.now(),
      name: itemName, 
      price: parsedPrice,
      category: itemCategory
    }));

    showNotification(`"${itemName}" adicionado com sucesso!`);
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

  const incrementQty = (id, currentQty) => {
    const nextQty = (currentQty || 1) + 1;
    if (nextQty <= 100) dispatch(updateQuantity(id, nextQty));
  };

  const decrementQty = (id, currentQty) => {
    const nextQty = (currentQty || 1) - 1;
    if (nextQty >= 1) dispatch(updateQuantity(id, nextQty));
  };

  const handleRemoveItem = (id, name) => {
    dispatch(removeItem(id));
    showNotification(`"${name}" removido do painel.`, "error");
  };

  // Cálculos matemáticos base
  const totalUnidades = cartItems.reduce((acc, item) => acc + (item?.quantity || 0), 0);
  const totalBruto = cartItems.reduce((acc, item) => acc + ((item?.price || 0) * (item?.quantity || 1)), 0);

  // Opção 3: Lógica de Desconto Progressivo Automatizado (2% a cada 100 reais, limite de 25%)
  let porcentagemDesconto = 0;
  if (totalBruto >= 100) {
    porcentagemDesconto = Math.floor(totalBruto / 100) * 2;
    if (porcentagemDesconto > 25) {
      porcentagemDesconto = 25;
    }
  }

  const valorDesconto = (totalBruto * porcentagemDesconto) / 100;
  const totalComDesconto = totalBruto - valorDesconto;
  const totalFaturadoHistorico = salesHistory.reduce((acc, sale) => acc + sale.totalValue, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) return showNotification("Carrinho vazio!", "error");

    const newSale = {
      id: "SALE_" + Date.now(),
      date: new Date().toLocaleString('pt-BR'),
      itemsCount: totalUnidades,
      brutoValue: totalBruto,
      discountPercent: porcentagemDesconto,
      discountValue: valorDesconto,
      totalValue: totalComDesconto,
      payment: paymentMethod, // Gravando a forma de pagamento
      details: cartItems.map(i => ({ name: i.name, qty: i.quantity || 1 }))
    };

    const updatedHistory = [newSale, ...salesHistory];
    setSalesHistory(updatedHistory);
    localStorage.setItem('SALES_HISTORY', JSON.stringify(updatedHistory));
    
    dispatch(clearCart());
    setPaymentMethod('Dinheiro'); // Reseta para o padrão
    showNotification("Venda finalizada e gravada com sucesso!");
  };

  const handleClearHistory = () => {
    if (window.confirm("Deseja realmente limpar todo o histórico de faturamento?")) {
      setSalesHistory([]);
      localStorage.removeItem('SALES_HISTORY');
      showNotification("Histórico completamente limpo.", "error");
    }
  };

  const filteredItems = cartItems.filter(item => {
    if (activeFilter === 'Todos') return true;
    return item.category === activeFilter;
  });

  const styles = {
    container: { padding: '25px', fontFamily: 'sans-serif', maxWidth: '580px', margin: '30px auto', backgroundColor: '#1e293b', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.55)', position: 'relative' },
    toast: { position: 'fixed', top: '20px', right: '20px', padding: '15px 25px', borderRadius: '8px', color: '#ffffff', fontWeight: 'bold', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.3)', transition: 'all 0.3s ease', backgroundColor: toast.type === 'success' ? '#218838' : '#c82333', display: toast.visible ? 'block' : 'none' },
    tabsContainer: { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid rgba(255,255,255,0.08)', paddingBottom: '10px' },
    tabBtn: (tab) => ({ flex: 1, padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', backgroundColor: activeTab === tab ? '#ffc107' : 'rgba(255,255,255,0.08)', color: activeTab === tab ? '#111111' : '#ffffff', transition: 'background 0.2s' }),
    titleArea: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '25px' },
    title: { color: '#ffffff', fontSize: '26px', fontWeight: 'bold', margin: 0 },
    badge: { backgroundColor: '#ffc107', color: '#111111', padding: '4px 10px', borderRadius: '50px', fontSize: '14px', fontWeight: 'bold' },
    formInput: { width: '100%', padding: '12px', marginBottom: '12px', backgroundColor: '#ffffff', border: '1px solid #334155', borderRadius: '6px', boxSizing: 'border-box', fontSize: '15px', color: '#0f172a' },
    filterContainer: { display: 'flex', gap: '6px', margin: '15px 0', overflowX: 'auto', paddingBottom: '5px' },
    filterBtn: (filter) => ({ padding: '6px 12px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', minWidth: '70px', backgroundColor: activeFilter === filter ? '#ffffff' : 'rgba(255,255,255,0.12)', color: activeFilter === filter ? '#1e293b' : '#ffffff', transition: 'all 0.2s' }),
    itemRow: { padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '10px' },
    qtyContainer: { display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#ced4da', padding: '2px', borderRadius: '6px' },
    qtyBtn: { backgroundColor: '#ffffff', border: 'none', color: '#1e293b', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    qtyInput: { width: '45px', border: 'none', background: 'transparent', textAlign: 'center', fontWeight: 'bold', fontSize: '15px', outline: 'none', color: '#0f172a' },
    historyBox: { backgroundColor: '#0f172a', borderRadius: '8px', padding: '15px', marginBottom: '10px', borderLeft: '4px solid #ffc107', color: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', color: '#ffffff', fontSize: '15px', margin: '6px 0', opacity: 0.9 }
  };

  return (
    <div style={styles.container}>
      <div style={styles.toast}>{toast.message}</div>

      <div style={styles.tabsContainer}>
        <button onClick={() => setActiveTab('vendas')} style={styles.tabBtn('vendas')}>Painel de Vendas</button>
        <button onClick={() => setActiveTab('historico')} style={styles.tabBtn('historico')}>Histórico de Caixa</button>
      </div>

      {activeTab === 'vendas' ? (
        <>
          <div style={styles.titleArea}>
            <h1 style={styles.title}>Frente de Caixa</h1>
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
            <select 
              value={itemCategory} 
              onChange={(e) => setItemCategory(e.target.value)} 
              style={styles.formInput}
            >
              <option value="Salgados">Salgados</option>
              <option value="Bebidas">Bebidas</option>
              <option value="Doces">Doces</option>
              <option value="Outros">Outros</option>
            </select>
            <button type="submit" style={{ ...styles.formInput, backgroundColor: '#218838', color: 'white', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>
              Adicionar ao Carrinho
            </button>
          </form>

          <div style={styles.filterContainer}>
            {['Todos', 'Salgados', 'Bebidas', 'Doces', 'Outros'].map(f => (
              <button key={f} type="button" onClick={() => setActiveFilter(f)} style={styles.filterBtn(f)}>{f}</button>
            ))}
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0' }}>
            {filteredItems.map((item, index) => {
              if (!item) return null;
              const itemId = item.id || `fallback-id-${index}`;
              const currentQty = item.quantity || 1;

              return (
                <li key={itemId} style={styles.itemRow}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '55%' }}>
                    <span style={{ color: '#111111', fontWeight: 'bold', fontSize: '1rem', wordBreak: 'break-word' }}>
                      {item.name} <small style={{ color: '#0056b3', fontSize: '0.75rem', backgroundColor: '#e2f0fe', padding: '2px 6px', borderRadius: '10px' }}>{item.category}</small>
                    </span>
                    <span style={{ color: '#6c757d', fontSize: '0.85rem', fontWeight: '500' }}>
                      Valor: R$ {Number(item.price || 0).toFixed(2)} | Sub: R$ {(Number(item.price || 0) * currentQty).toFixed(2)}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={styles.qtyContainer}>
                      <button type="button" onClick={() => decrementQty(itemId, currentQty)} style={styles.qtyBtn}>-</button>
                      <input type="number" min="1" max="100" value={currentQty} onChange={(e) => handleQuantityChange(itemId, e.target.value)} style={styles.qtyInput} />
                      <button type="button" onClick={() => incrementQty(itemId, currentQty)} style={styles.qtyBtn}>+</button>
                    </div>
                    <button onClick={() => handleRemoveItem(itemId, item.name)} style={{ backgroundColor: '#e05300', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                      Remover
                    </button>
                  </div>
                </li>
              );
            })}
            {filteredItems.length === 0 && cartItems.length > 0 && (
              <p style={{ color: '#fff', textAlign: 'center', fontSize: '14px', opacity: 0.7 }}>Nenhum item nesta categoria.</p>
            )}
          </ul>

          {cartItems.length > 0 && (
            <div style={{ marginTop: '15px', borderTop: '2px dashed rgba(255,255,255,0.2)', paddingTop: '15px' }}>
              {/* Opção 3: Painel de detalhamento de taxas e cálculos */}
              <div style={styles.summaryRow}>
                <span>Subtotal Bruto:</span>
                <span>R$ {totalBruto.toFixed(2)}</span>
              </div>
              
              {porcentagemDesconto > 0 && (
                <div style={{ ...styles.summaryRow, color: '#ffc107', fontWeight: '500' }}>
                  <span>Desconto Progressivo ({porcentagemDesconto}%):</span>
                  <span>- R$ {valorDesconto.toFixed(2)}</span>
                </div>
              )}

              <div style={{ color: '#ffffff', textAlign: 'right', fontWeight: 'bold', fontSize: '22px', margin: '10px 0' }}>
                TOTAL A PAGAR: R$ {totalComDesconto.toFixed(2)}
              </div>

              {/* Opção 3: Menu de Seleção de Forma de Pagamento */}
              <label style={{ color: '#ffffff', display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '6px', marginTop: '15px' }}>
                Forma de Pagamento:
              </label>
              <select 
                value={paymentMethod} 
                onChange={(e) => setPaymentMethod(e.target.value)} 
                style={styles.formInput}
              >
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartão">Cartão de Crédito/Débito</option>
                <option value="Pix">Pix</option>
              </select>

              <button onClick={handleCheckout} style={{ ...styles.formInput, backgroundColor: '#ffc107', color: '#111111', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', border: 'none' }}>
                ✓ Finalizar Venda (Salvar no Caixa)
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <div style={styles.titleArea}>
            <h1 style={styles.title}>Faturamento Total</h1>
          </div>
          <div style={{ backgroundColor: '#218838', padding: '15px', borderRadius: '8px', color: '#fff', fontWeight: 'bold', fontSize: '18px', textAlign: 'center', marginBottom: '20px' }}>
            CAIXA ACUMULADO: R$ {totalFaturadoHistorico.toFixed(2)}
          </div>

          <div style={{ maxHeight: '320px', overflowY: 'auto', paddingRight: '5px' }}>
            {salesHistory.map((sale) => (
              <div key={sale.id} style={styles.historyBox}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', opacity: 0.8, marginBottom: '5px' }}>
                  <span>{sale.date}</span>
                  <span style={{ fontWeight: 'bold', color: '#ffc107' }}>R$ {sale.totalValue.toFixed(2)}</span>
                </div>
                
                {/* Opção 3: Detalhes extras de pagamento e descontos aplicados salvos na venda */}
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
                  Modo: {sale.payment} {sale.discountPercent > 0 && `| Desconto: ${sale.discountPercent}% (-R$ ${sale.discountValue.toFixed(2)})`}
                </div>

                <div style={{ fontSize: '14px', fontWeight: '500' }}>
                  {sale.details.map((d, i) => (
                    <span key={i} style={{ display: 'inline-block', marginRight: '10px', fontSize: '12px', backgroundColor: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px', marginTop: '4px' }}>
                      {d.name} ({d.qty}x)
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {salesHistory.length === 0 && (
              <p style={{ color: '#fff', textAlign: 'center', opacity: 0.6, fontSize: '14px' }}>Nenhuma venda registrada hoje.</p>
            )}
          </div>

          {salesHistory.length > 0 && (
            <button onClick={handleClearHistory} style={{ ...styles.formInput, backgroundColor: '#c82333', color: 'white', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px', border: 'none' }}>
              Zerar Histórico do Caixa
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ShoppingCart;