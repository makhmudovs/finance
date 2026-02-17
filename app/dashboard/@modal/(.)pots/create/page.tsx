import { Modal } from "@/app/components/modal";
import { Form } from "@/app/components/pots/create-form";

export default async function CreatePotModal() {
  return (
    <Modal
      title="Create pot"
      returnUrl="/dashboard/pots" // Explicitly set the return URL
    >
      <Form />
    </Modal>
  );
}
