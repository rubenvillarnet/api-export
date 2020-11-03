import React, { useReducer, useContext, createContext, useEffect } from 'react';
import { parseCookies, destroyCookie } from 'nookies';

const CounterStateContext = createContext();
const CounterDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        token: action.payload
      };
    case 'LOGOUT':
      destroyCookie(null, 'token', { path: '/' });
      return {
        ...state,
        token: undefined
      };
    case 'LOADED':
      return {
        ...state,
        loading: false
      };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

export default function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    token: undefined,
    loading: true
  });
  useEffect(() => {
    const cookies = parseCookies();
    if (cookies.token) {
      dispatch({
        type: 'LOGIN',
        payload: cookies.token
      });
    }
    dispatch({
      type: 'LOADED'
    });
  }, []);
  return (
    <CounterDispatchContext.Provider value={dispatch}>
      <CounterStateContext.Provider value={state}>
        {children}
      </CounterStateContext.Provider>
    </CounterDispatchContext.Provider>
  );
}

export const useAuth = () => useContext(CounterStateContext);
export const useDispatchAuth = () => useContext(CounterDispatchContext);
