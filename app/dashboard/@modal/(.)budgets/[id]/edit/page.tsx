import { Modal } from "@/app/components/modal";
import { EditBudgetForm } from "@/app/components/budgets/edit-form";
import { fetchBudgetById } from "@/app/lib/budget-actions";

export default async function EditBudgetModal(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;

  const budget = await fetchBudgetById(id);
  return (
    <Modal
      title="Edit Budget"
      returnUrl="/dashboard/budgets" // Explicitly set the return URL
    >
      <EditBudgetForm budget={budget} />
    </Modal>
  );
}
