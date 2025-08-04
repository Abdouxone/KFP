// Data Table
import SubCategoryDetails from "@/components/dashboard/forms/subCategory-details";
import DataTable from "@/components/ui/data-table";

//Queries

import { getAllCategories } from "@/queries/category";
import { getAllSubCategories } from "@/queries/Subcategory";
import { Plus } from "lucide-react";
import { columns } from "./columns";

export default async function AdminSubCategoriesPage() {
  // Fetching subCategories data from the database
  const subCategories = await getAllSubCategories();

  //Checking if no subCategories are found
  if (!subCategories) return null; //if no subcategories found, return null

  //Fetching categories from the database\
  const categories = await getAllCategories();

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create SubCategory
        </>
      }
      modalChildren={<SubCategoryDetails categories={categories} />}
      newTabLink="/dashboard/admin/subCategories/new"
      filterValue="name"
      data={subCategories}
      searchPlaceholder="Search subCategory name..."
      columns={columns}
    />
  );
}
