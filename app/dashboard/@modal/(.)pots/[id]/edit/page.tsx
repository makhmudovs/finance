import { Modal } from "@/app/components/modal";
import { EditPotForm } from "@/app/components/pots/edit-form";
import { fetchPotById } from "@/app/lib/pot-actions";

export default async function EditPotModal(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;

  const pot = await fetchPotById(id);
  return (
    <Modal
      title="Edit Pot"
      returnUrl="/dashboard/pots" // Explicitly set the return URL
    >
      <EditPotForm pot={pot} />
    </Modal>
  );
}
