"use client"

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";

import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner";
import FormFields from "./FormFields";
import { singIn, singUp } from "@/lib/actions/auth.action";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
}

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    try {
      if (type === 'sign-up') {
        console.log('Sign-Un', values);

        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

        const result = await singUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        })

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success('Account created succsessfully. Please sign-in');
        router.push('/sign-in');
      } else {
        console.log('Sign-In', values);

        const { email, password } = values;

        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        const idToken = await userCredential.user.getIdToken();

        if (!idToken) {
          toast.error('Sign in failed');
          return;
        }

        await singIn({ email, idToken });

        toast.success('Signed in successfully.')
        router.push('/');
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  }

  const isSign = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">
            Prepwise
          </h2>
        </div>
        <h3>
          Practice job interview with AI
        </h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
            {!isSign && (
              <FormFields
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your name"
              />
            )}
            <FormFields
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />
            <FormFields
              control={form.control}
              name="password"
              label="Password"
              placeholder="Please enter your password"
              type="password"
            />
            <Button
              type="submit"
              className="btn"
            >
              {isSign ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSign ? 'No account yet' : 'Have an account already?'}
          <Link
            href={!isSign ? '/sign-in' : '/sign-up'}
            className="font-bold text-user-primary ml-1"
          >
            {!isSign ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm;