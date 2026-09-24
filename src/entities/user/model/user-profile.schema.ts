import { z } from 'zod'

import { userRole } from '../config/user-role'

export const userRoleSchema = z.enum([userRole.defectologist, userRole.headDefectologist])

export const userProfileSchema = z
  .object({
    id: z.string().optional(),
    email: z.string().optional(),
    role: userRoleSchema.catch(userRole.defectologist),
    email_verified: z.boolean().optional(),
    display_name: z.string().nullable().optional(),
    avatar_url: z.string().nullable().optional(),
    org_id: z.string().nullable().optional(),
    created_at: z.string().optional(),
  })
  .transform((profile) => ({
    id: profile.id ?? null,
    email: profile.email ?? null,
    name: profile.display_name ?? null,
    avatarUrl: profile.avatar_url ?? null,
    role: profile.role,
    isEmailVerified: profile.email_verified ?? false,
    orgId: profile.org_id ?? null,
  }))

export type TUserProfile = z.infer<typeof userProfileSchema>
