import { Role, User } from "@/generated/prisma";
import { db } from "@/lib/db";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { create } from "domain";
import { NextRequest } from "next/server";
import { json } from "stream/consumers";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    // Do something with payload
    // For this guide, log payload to console
    // const { id } = evt.data;
    // const eventType = evt.type;
    // When user is created or updated, we want to ensure they are in our database
    if (evt.type === "user.created" || evt.type === "user.updated") {
      const data = evt.data;
      const user: Partial<User> = {
        id: data.id,
        name: `${data.first_name} ${data.last_name}`,
        email: data.email_addresses[0].email_address,
        picture: data.image_url,
      };
      if (!user) return;
      const dbUser = await db.user.upsert({
        where: {
          email: user.email,
        },
        update: user,
        create: {
          id: user.id!,
          name: user.name!,
          email: user.email!,
          picture: user.picture!,
          role: user.role || "USER",
        },
      });

      await clerkClient.users.updateUserMetadata(data.id, {
        privateMetadata: {
          role: dbUser.role || "USER",
        },
      });
    }
    // When user is deleted, we want to remove them from our database
    if (evt.type === "user.deleted") {
      const data = evt.data;
      await db.user.delete({
        where: {
          id: data.id,
        },
      });
    }
    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
