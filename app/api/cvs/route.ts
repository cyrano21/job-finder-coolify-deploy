import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/app/utils/dbConnect'
import CV from '@/app/modules/cv/utils/cv-model'
import User from '@/app/modules/user-model'
import { getAuth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const { userId: authUserId } = getAuth(request)
    if (!userId || !authUserId || userId !== authUserId) {
      return NextResponse.json([], { status: 200 })
    }
    const cvs = await CV.find({ userId })
    return NextResponse.json(cvs)
  } catch (error) {
    console.error('Error in GET /api/cvs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const { userId: authUserId } = getAuth(request)
    if (!authUserId || body.userId !== authUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    // Server-side quota enforcement based on subscription plan
    const user = await User.findById(authUserId)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    const planLimits: Record<string, number> = { FREE: 1, PRO: 5 }
    const limit = planLimits[user.role] ?? Infinity
    const currentCount = await CV.countDocuments({ userId: authUserId })
    if (currentCount >= limit) {
      return NextResponse.json({ error: 'CV creation quota reached' }, { status: 403 })
    }
    const cv = await CV.create(body)
    return NextResponse.json(cv, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/cvs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH : update a CV by id
export async function PATCH(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const { id, userId, ...update } = body
    const { userId: authUserId } = getAuth(request)
    if (!id || !authUserId || userId !== authUserId) {
      return NextResponse.json({ error: 'Unauthorized or missing CV id' }, { status: 403 })
    }
    const updatedCV = await CV.findOneAndUpdate({ _id: id, userId }, update, { new: true })
    return NextResponse.json(updatedCV)
  } catch (error) {
    console.error('Error in PATCH /api/cvs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE : delete a CV by id
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')
    const { userId: authUserId } = getAuth(request)
    if (!id || !userId || !authUserId || userId !== authUserId) {
      return NextResponse.json({ error: 'Unauthorized or missing CV id' }, { status: 403 })
    }
    await CV.findOneAndDelete({ _id: id, userId })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/cvs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
