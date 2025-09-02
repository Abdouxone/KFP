"use client";
// React
import { useState } from "react";

// Prisma
import { Category } from "@/generated/prisma";
import CategoriesMenu from "./categories-menu";

export default function CategoriesHeaderContainer({
  categories,
}: {
  categories: Category[];
}) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="w-full px-4 flex items-center gap-x-1">
      {/* Category menu */}
      <CategoriesMenu categories={categories} open={open} setOpen={setOpen} />
    </div>
  );
}
