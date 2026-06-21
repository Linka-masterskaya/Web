import type { TChangeUserPasswordFormValues } from '@entities/user'
import type { TEditNameFormProps } from './types'

export const UpdatePasswordForm: React.FC<TEditNameFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TChangeUserPasswordFormValues>({
    resolver: zodResolver(),
    defaultValues: forgotPasswordFormDefaultValues,
  })
}
