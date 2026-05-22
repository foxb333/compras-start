import { ADD_ITEM, REMOVE_ITEM, CLEAR_CART, UPDATE_QUANTITY } from './cartActions';

const initialState = {
  cartItems: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ITEM: {
      const itemExists = state.cartItems.find(item => item.id === action.payload.id);
      
      if (itemExists) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === action.payload.id 
              ? { ...item, quantity: Math.min((item.quantity || 1) + 1, 100) } 
              : item
          ),
        };
      }
      return {
        ...state,
        cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
      };
    }

    case REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload),
      };

    case UPDATE_QUANTITY:
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case CLEAR_CART:
      return { 
        ...state, 
        cartItems: [] 
      };

    default:
      return state;
  }
};

export default cartReducer;