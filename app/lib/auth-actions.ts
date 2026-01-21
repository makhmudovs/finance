
import { SigninFormSchema, FormState } from "@/app/lib/definitions";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {z} from 'zod';


export async function authenticate(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Validate form data
  const validatedFields = SigninFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
      message: "Invalid fields.",
    };
  }

  const { email, password } = validatedFields.data;
  console.log(email, password);

  try {
    await authClient.signIn.email({
      email,
      password
    },{
      
    })

    //save the jwt in http only cookies and redirect the user
  } catch (error) {
    console.error("Authentication error:", error);
    return {
      message: "Something went wrong.",
    };
  }
}
