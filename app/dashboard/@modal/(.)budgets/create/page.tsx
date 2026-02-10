import { Modal } from "@/app/components/modal";
import { Form } from "@/app/components/budgets/create-form";

export default async function CreateBudgetModal() {
  return (
    <Modal
      title="Create budget"
      returnUrl="/dashboard/budgets" // Explicitly set the return URL
    >
      <Form />
    </Modal>
  );
}
