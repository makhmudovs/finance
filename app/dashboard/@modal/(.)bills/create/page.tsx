import { Modal } from "@/app/components/modal";
import { Form } from "@/app/components/bills/create-form";

export default async function CreateBillModal() {
  return (
    <Modal
      title="Create bill"
      returnUrl="/dashboard/bills" // Explicitly set the return URL
    >
      <Form />
    </Modal>
  );
}
