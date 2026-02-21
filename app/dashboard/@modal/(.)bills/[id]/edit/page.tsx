import { Modal } from "@/app/components/modal";
import { EditBillForm } from "@/app/components/bills/edit-form";
import { fetchBillById } from "@/app/lib/bill-actions";

export default async function EditBillModal(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;

  const bill = await fetchBillById(id);
  return (
    <Modal
      title="Edit Bill"
      returnUrl="/dashboard/bills" // Explicitly set the return URL
    >
      <EditBillForm bill={bill} />
    </Modal>
  );
}
