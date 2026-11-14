import config from '@payload-config'
import { cookies } from 'next/headers'
import { getPayload, JWTAuthentication } from 'payload'

const SESSION_COOKIE = 'app-session'

export function createAppAuth(appUserCollection: 'users') {
  return {
    async login(email: string, password: string) {
      const payload = await getPayload({ config })
      const result = await payload.login({
        collection: appUserCollection,
        data: { email, password },
      })
      if (!result.token || !result.user || result.user.collection !== appUserCollection) return null

      ;(await cookies()).set(SESSION_COOKIE, result.token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 8,
      })
      return result.user
    },
    async logout() {
      ;(await cookies()).delete(SESSION_COOKIE)
    },
    async currentUser() {
      const token = (await cookies()).get(SESSION_COOKIE)?.value
      if (!token) return null

      const payload = await getPayload({ config })
      const authHeaders = new Headers({ Authorization: `Bearer ${token}` })
      const { user } = await JWTAuthentication({ headers: authHeaders, payload })
      if (!user || user.collection !== appUserCollection) return null
      return user
    },
  }
}

export const appAuth = createAppAuth('users')
