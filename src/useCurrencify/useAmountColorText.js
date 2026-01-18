export function useAmountColorText (amount) {
  if (amount >0) return 'text-positive'
  else if (amount <0) return 'text-negative'
  else return 'text-dark'
}
