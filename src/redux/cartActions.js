export const ADD_ITEM = 'ADD_ITEM';
export const REMOVE_ITEM = 'REMOVE_ITEM';
export const CLEAR_CART = 'CLEAR_CART';
export const UPDATE_QUANTITY = 'UPDATE_QUANTITY';

// Action atualizada para aceitar o objeto completo incluindo a categoria escolhida
export const addItem = (item) => ({
  type: ADD_ITEM,
  payload: {
    id: item.id,
    name: item.name,
    price: item.price,
    category: item.category || 'Outros'
  },
});

export const removeItem = (id) => ({
  type: REMOVE_ITEM,
  payload: id,
});

export const clearCart = () => ({
  type: CLEAR_CART,
});

export const updateQuantity = (id, quantity) => ({
  type: UPDATE_QUANTITY,
  payload: { id, quantity },
});