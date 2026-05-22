import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, clearCart } from '../redux/cartActions';

const ShoppingCart = () => {
  const cartItems = useSelector((state) => state.cartItems);
  const dispatch = useDispatch();

  const handleAddItem = () => {
    dispatch(addItem({ id: 1, name: 'Laptop', price: 1500 }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeItem(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const styles = {
    container: { 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '450px',
      margin: '20px auto',
      backgroundColor: '#3b7197', // Fundo principal Azul
      borderRadius: '8px',
      boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
    },
    title: {
      textAlign: 'center', 
      color: '#ffffff', 
      marginBottom: '20px',
      fontSize: '24px',
      fontWeight: '600'
    },
    btnAdd: { 
      backgroundColor: '#28a745', // Botão Verde
      color: 'white', 
      border: 'none', 
      padding: '10px 18px', 
      borderRadius: '5px', 
      cursor: 'pointer', 
      fontSize: '14px',
      fontWeight: 'bold',
      width: '100%'
    },
    btnRemove: { 
      backgroundColor: '#fd7e14', // Botão Laranja
      color: 'white', 
      border: 'none', 
      padding: '6px 12px', 
      borderRadius: '4px', 
      cursor: 'pointer', 
      fontSize: '12px',
      fontWeight: '500'
    },
    btnClear: { 
      backgroundColor: '#dc3545', // Botão Vermelho
      color: 'white', 
      border: 'none', 
      padding: '12px 20px', 
      borderRadius: '5px', 
      cursor: 'pointer', 
      marginTop: '15px', 
      width: '100%', 
      fontSize: '15px', 
      fontWeight: 'bold'
    },
    itemList: {
      listStyle: 'none',
      padding: 0,
      margin: '20px 0'
    },
    itemRow: { 
      padding: '12px 10px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      backgroundColor: '#e9ecef', // Fundo secundário Cinza para as caixas dos itens
      borderRadius: '4px',
      marginBottom: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Carrinho de Compras</h1>

      <button onClick={handleAddItem} style={styles.btnAdd}>
        + Adicionar Laptop
      </button>

      <ul style={styles.itemList}>
        {cartItems.map((item) => (
          <li key={item.id} style={styles.itemRow}>
            <span style={{ color: '#212529', fontWeight: 'bold' }}>
              {item.name} - {item.quantity || 1}x R${item.price}
            </span>
            <button onClick={() => handleRemoveItem(item.id)} style={styles.btnRemove}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      {cartItems.length > 0 && (
        <button onClick={handleClearCart} style={styles.btnClear}>
          Esvaziar Carrinho
        </button>
      )}
    </div>
  );
};

export default ShoppingCart;