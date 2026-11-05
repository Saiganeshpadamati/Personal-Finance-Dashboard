import { Transaction } from '../types'
import { paiseToRupees } from './currency'

/**
 * Downloads transaction ledger as formatted CSV file
 */
export const exportTransactionsToCSV = (
  transactions: Transaction[],
  filename = `FinFlow_Transactions_${new Date().toISOString().slice(0, 10)}.csv`
) => {
  const headers = ['ID', 'Date', 'Merchant', 'Category', 'Type', 'Amount (INR)', 'Payment Method', 'Status', 'Account', 'Description']

  const rows = transactions.map((t) => [
    `"${t.id}"`,
    `"${t.date}"`,
    `"${t.merchant.replace(/"/g, '""')}"`,
    `"${t.category}"`,
    `"${t.type}"`,
    `"${(t.type === 'expense' ? -1 : 1) * paiseToRupees(t.amountInPaise)}"`,
    `"${t.paymentMethod}"`,
    `"${t.status}"`,
    `"${t.accountId}"`,
    `"${(t.description || '').replace(/"/g, '""')}"`,
  ])

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Exports complete state backup as JSON file
 */
export const exportStateToJSON = (
  data: Record<string, unknown>,
  filename = `FinFlow_Backup_${new Date().toISOString().slice(0, 10)}.json`
) => {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`
  const downloadAnchor = document.createElement('a')
  downloadAnchor.setAttribute('href', jsonString)
  downloadAnchor.setAttribute('download', filename)
  document.body.appendChild(downloadAnchor)
  downloadAnchor.click()
  downloadAnchor.remove()
}
