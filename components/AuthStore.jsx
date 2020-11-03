import React, { useReducer, useContext, createContext } from 'react';

const CounterStateContext = createContext();
const CounterDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return action.payload;
    case 'LOGOUT':
      return undefined;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

export default function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined);
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
