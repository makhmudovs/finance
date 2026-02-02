import { EditTransactionForm } from '@/app/components/transactions/edit-form';

export default function EditTransactionPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Transaction</h1>
      <EditTransactionForm transactionId={params.id} />
    </div>
  )
}