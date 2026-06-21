import { useState } from 'react'

/**
 * useLocalStorage
 * ---------------
 * Hook que espelha o useState, mas persiste o valor no localStorage.
 * Ao abrir a página, os dados são restaurados automaticamente.
 *
 * @param {string} chave  – chave usada no localStorage
 * @param {*}      inicio – valor inicial caso a chave não exista
 */
export function useLocalStorage(chave, inicio) {
  const [valor, setValor] = useState(() => {
    try {
      const item = localStorage.getItem(chave)
      return item ? JSON.parse(item) : inicio
    } catch {
      return inicio
    }
  })

  const salvarValor = (novo) => {
    const proximo = typeof novo === 'function' ? novo(valor) : novo
    setValor(proximo)
    try {
      localStorage.setItem(chave, JSON.stringify(proximo))
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e)
    }
  }

  return [valor, salvarValor]
}


export default useLocalStorage;