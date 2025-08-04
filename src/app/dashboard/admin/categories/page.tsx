// Queries
import CategoryDetails from "@/components/dashboard/forms/category-details";
import DataTable from "@/components/ui/data-table";

//Data Table
import { getAllCategories } from "@/queries/category";
import { Plus } from "lucide-react";
import { columns } from "./columns";

export default async function AdminCategoriesPage() {
  //Fetching stores data from the database
  const categories = await getAllCategories();

  //Checking if mo categories are found
  if (!categories) return null; //if no Categories found, return null

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create category
        </>
      }
      modalChildren={<CategoryDetails />}
      newTabLink="/dashboard/admin/categories/new"
      filterValue="name"
      data={categories}
      searchPlaceholder="Search category name..."
      columns={columns}
    />
  );
}
