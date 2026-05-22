import { ADD_ITEM, REMOVE_ITEM, CLEAR_CART } from './cartActions';

const initialState = {
  cartItems: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ITEM:
      // Verifica se o item já existe no carrinho para aumentar a quantidade
      const itemExists = state.cartItems.find(item => item.id === action.payload.id);
      
      if (itemExists) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === action.payload.id 
              ? { ...item, quantity: (item.quantity || 1) + 1 } 
              : item
          ),
        };
      }
      
      return {
        ...state,
        cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
      };

    case REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload),
      };

    case CLEAR_CART:
      return {
        ...state,
        cartItems: [], // Retorna o estado com o array totalmente vazio
      };

    default:
      return state;
  }
};

export default cartReducer;