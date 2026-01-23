/**
 * API-Endpunkt für Passwort-Prüfung
 * 
 * Route: POST /api/admin/check-password
 * 
 * Prüft das eingegebene Passwort gegen ADMIN_PASSWORD aus ENV.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAdminPassword } from '@/lib/env'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * POST /api/admin/check-password
 * 
 * Prüft das eingegebene Passwort
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { status: 'error', message: 'Passwort ist erforderlich' },
        { status: 400 }
      )
    }

    const adminPassword = getAdminPassword()

    if (password.trim() === adminPassword) {
      return NextResponse.json({ status: 'success', authenticated: true })
    } else {
      return NextResponse.json(
        { status: 'error', message: 'Falsches Passwort', authenticated: false },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('[API] Fehler bei Passwort-Prüfung:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unbekannter Fehler',
      },
      { status: 500 }
    )
  }
}
