import { Modal } from "@/app/components/modal";
import { EditTransactionForm } from "@/app/components/transactions/edit-form";
import { fetchTransactionById } from "@/app/lib/data";

export default async function EditTransactionModal(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;

  const transaction = await fetchTransactionById(id);
  return (
    <Modal
      title="Edit Transaction"
      returnUrl="/dashboard/transactions" // Explicitly set the return URL
    >
      <EditTransactionForm transaction={transaction} />
    </Modal>
  );
}
