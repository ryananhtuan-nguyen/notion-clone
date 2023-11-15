'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Link from 'next/link'
import Image from 'next/image'
import { z } from 'zod'

import Logo from '../../../../public/cypresslogo.svg'
import { cn } from '@/lib/utils'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Loader from '@/components/global/Loader'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { MailCheck } from 'lucide-react'
import { FormSchema } from '@/lib/types'
import { actionSignUpUser } from '@/lib/server-action/auth-actions'

const signUpFormSchema = z
  .object({
    email: z.string().describe('Email').email({ message: 'Invalid email' }),
    password: z
      .string()
      .describe('Password')
      .min(6, 'Password must be minimum of 6 characters'),
    confirmPassword: z
      .string()
      .describe('Confirm Password')
      .min(6, 'Password must be 6 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

const SignUp = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [submitError, setSubmitError] = useState('')
  const [confirmation, setConfirmation] = useState(false)

  const codeExchangeError = useMemo(() => {
    if (!searchParams) return ''
    return searchParams.get('error_description')
  }, [searchParams])

  const confirmationAndErrorStyles = useMemo(
    () =>
      cn('bg-primary', {
        'bg-red-500/10': codeExchangeError,
        'border-red-500/50': codeExchangeError,
        'text-red-700': codeExchangeError,
      }),
    []
  )

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(signUpFormSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  })

  const isLoading = form.formState.isSubmitting
  const onSubmit = async ({ email, password }: z.infer<typeof FormSchema>) => {
    const { error } = await actionSignUpUser({ email, password })
    if (error) {
      setSubmitError(error.message)
      form.reset()
      return
    }

    setConfirmation(true)
  }

  return (
    <Form {...form}>
      <form
        onChange={() => {
          if (submitError) setSubmitError('')
        }}
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full sm:justify-center sm:w-[400px] space-y-6 flex flex-col"
      >
        <Link
          href="/"
          className="
          w-full
          flex
          justify-left
          items-center"
        >
          <Image src={Logo} alt="cypress Logo" width={50} height={50} />
          <span
            className="font-semibold
          dark:text-white text-4xl first-letter:ml-2"
          >
            cypress.
          </span>
        </Link>
        <FormDescription
          className="
        text-foreground/60"
        >
          An all-In-One Collaboration and Productivity Platform
        </FormDescription>
        {!confirmation && !codeExchangeError && (
          <>
            <FormField
              disabled={isLoading}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full p-6" disabled={isLoading}>
              {!isLoading ? 'Create Account' : <Loader />}
            </Button>
          </>
        )}

        {submitError && <FormMessage>{submitError}</FormMessage>}

        <span className="self-container">
          Already have an account?{' '}
          <Link href="/login" className="text-primary">
            Login
          </Link>
        </span>
        {(confirmation || codeExchangeError) && (
          <>
            <Alert className={confirmationAndErrorStyles}>
              {!codeExchangeError && <MailCheck className="h-4 w-4" />}
              <AlertTitle>
                {codeExchangeError ? 'Invalid Link' : 'Check your email.'}
              </AlertTitle>
              <AlertDescription>
                {codeExchangeError || 'An email confirmation has been sent.'}
              </AlertDescription>
            </Alert>
          </>
        )}
      </form>
    </Form>
  )
}

export default SignUp
