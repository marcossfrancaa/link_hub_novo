import { useState, useEffect } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  // Obter valor do localStorage ou usar o valor inicial
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao ler ${key} do localStorage:`, error);
      return initialValue;
    }
  });

  // Atualizar localStorage quando o valor mudar
  const setValue = (value: T) => {
    try {
      // Permitir que o valor seja uma função para que tenhamos a mesma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error);
    }
  };

  return [storedValue, setValue];
};