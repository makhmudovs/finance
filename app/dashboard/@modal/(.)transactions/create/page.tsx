import { Modal } from "@/app/components/modal";
import { Form } from "@/app/components/transactions/create-form";

export default async function EditTransactionModal() {
  return (
    <Modal
      title="Create transaction"
      returnUrl="/dashboard/transactions" // Explicitly set the return URL
    >
      <Form />
    </Modal>
  );
}
