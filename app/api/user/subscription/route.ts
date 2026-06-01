import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/app/utils/dbConnect";
import User from "@/app/modules/user-model";

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification avec Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Récupérer l'utilisateur par son ID Clerk ou email
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    let user;
    if (email) {
      user = await User.findOne({ email });
    } else {
      // Si pas d'email fourni, on pourrait utiliser l'ID Clerk mais on va demander l'email
      return NextResponse.json(
        { error: "Email parameter required" },
        { status: 400 }
      );
    }

    if (!user) {
      // Créer un utilisateur par défaut si il n'existe pas
      user = await User.create({
        email,
        name: "",
        subscriptionStatus: "inactive",
        role: "FREE",
        plan: "free",
      });
    }

    // Retourner les informations d'abonnement
    return NextResponse.json({
      plan: user.plan || "free",
      role: user.role || "FREE",
      subscriptionStatus: user.subscriptionStatus || "inactive",
      stripeCustomerId: user.stripeCustomerId || null,
      stripeSubscriptionId: user.stripeSubscriptionId || null,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Error in GET /api/user/subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Vérifier l'authentification avec Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const {
      email,
      plan,
      subscriptionStatus,
      stripeCustomerId,
      stripeSubscriptionId,
    } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Mettre à jour l'utilisateur
    const user = await User.findOneAndUpdate(
      { email },
      {
        plan: plan || "free",
        subscriptionStatus: subscriptionStatus || "inactive",
        stripeCustomerId,
        stripeSubscriptionId,
        role: plan === "premium" ? "PREMIUM" : "FREE",
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      plan: user.plan,
      role: user.role,
      subscriptionStatus: user.subscriptionStatus,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId,
      email: user.email,
    });
  } catch (error) {
    console.error("Error in PUT /api/user/subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification avec Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { email, plan = "free" } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Créer un nouvel utilisateur avec abonnement
    const user = await User.create({
      email,
      plan,
      subscriptionStatus: plan === "free" ? "active" : "inactive",
      role: plan === "premium" ? "PREMIUM" : "FREE",
    });

    return NextResponse.json(
      {
        plan: user.plan,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
        email: user.email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/user/subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
