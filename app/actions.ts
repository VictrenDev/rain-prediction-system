"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";

const schema = z.object({
  pressureDropHpa: z.number().min(0.5).max(3),
  humidityPct: z.number().min(60).max(95),
  multiNodeCheck: z.boolean(),
});

export async function saveSettings(input: unknown) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid values." };

  const v = parsed.data;
  await db
    .insert(settings)
    .values({ id: "default", ...v })
    .onConflictDoUpdate({
      target: settings.id,
      set: { ...v, updatedAt: new Date() },
    });

  revalidatePath("/");
  return { ok: true as const };
}
