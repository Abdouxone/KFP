"use client";
//Prisma Model
import { Category } from "@/generated/prisma/client";

// Schema import
import { CategoryFormSchema } from "@/lib/schemas";

//React Component
import { FC, useEffect } from "react";

//form handling utilities
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//UI Components
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/dashboard/shared/image-upload";

// queries import
import { upsertCategory } from "@/queries/category";

//Utils
import { v4 } from "uuid";
// import { useToast } from "../ui/use-toast";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CategoryDetailsProps {
  data?: Category;
  // cloudinary_key: string;
}

const CategoryDetails: FC<CategoryDetailsProps> = ({
  data,
  // cloudinary_key,
}) => {
  //Initializing necessary hooks
  // const { toast } = useToast(); //Hook for displaying toast messages
  const Router = useRouter(); //Hook for programmatic navigation

  //Form hook for managing form state and validation
  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    mode: "onChange", //Validation mode
    resolver: zodResolver(CategoryFormSchema), //Zod schema resolver for validation
    defaultValues: {
      //setting default form values from data (if available)
      name: data?.name ?? "",
      image: data?.image ? [{ url: data?.image }] : [],
      url: data?.url ?? "",
      featured: data?.featured ?? false,
    },
  });

  //Loading state for form submission
  const isLoading = form.formState.isSubmitting;

  //Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name ?? "",
        image: [{ url: data.image }],
        url: data?.url ?? "",
        featured: data?.featured ?? false,
      });
    }
  }, [data, form]);

  //submit handler for the form
  const handleSubmit = async (values: z.infer<typeof CategoryFormSchema>) => {
    try {
      //Upserting category data

      const response = await upsertCategory({
        id: data?.id ? data.id : v4(),
        name: values.name,
        image: values.image[0].url,
        url: values.url,
        featured: values.featured ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Redirect or Refresh data
      if (data?.id) {
        Router.refresh();
      } else {
        Router.push("/dashboard/admin/categories");
      }

      //Displaying success message
      // toast({
      //   title: data?.id
      //     ? "Category has been updated."
      //     : `Congratulations! '${response?.name}' is now created.} `,
      // });

      if (data?.id) {
        toast.success("Category has been updated.");
      } else {
        toast.success(`Congratulations!  '${response?.name}' is now created.`);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.toString());
      // toast({
      //   variant: "destructive",
      //   title: "Oops!",
      //   description: error.toString(),
      // });
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="textbold font-barlow ">
            Category Information
          </CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name} category information.`
              : "Let's create a new category!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        type="profile"
                        // cloudinary_key={cloudinary_key}
                        value={field.value.map((image) => image.url)}
                        disabled={isLoading}
                        onChange={(url) => field.onChange([{ url }])}
                        onRemove={(url) =>
                          field.onChange([
                            ...field.value.filter(
                              (current) => current.url !== url
                            ),
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                // disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                // disabled={isLoading}
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category url</FormLabel>
                    <FormControl>
                      <Input placeholder="/category-url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        // @ts-ignore
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This Category will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "loading..."
                  : data?.id
                  ? "Save category information"
                  : "Create category"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default CategoryDetails;
