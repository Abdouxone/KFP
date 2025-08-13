"use client";
//Prisma Model
import { Category, Store } from "@/generated/prisma/client";

// Schema import
import { ProductFormSchema } from "@/lib/schemas";

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
import { Textarea } from "@/components/ui/textarea";

// queries import
import { upsertstore } from "@/queries/store";

//Utils
import { v4 } from "uuid";

// import { useToast } from "../ui/use-toast";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Types
import { ProductWithVariantType } from "@/lib/types";

interface ProductDetailsProps {
  data?: ProductWithVariantType;
  categories: Category[];
  StoreUrl: string;
  // cloudinary_key: string;
}

const ProductDetails: FC<ProductDetailsProps> = ({
  data,
  categories,
  StoreUrl,
  // cloudinary_key,
}) => {
  //Initializing necessary hooks
  // const { toast } = useToast(); //Hook for displaying toast messages
  const Router = useRouter(); //Hook for programmatic navigation

  //Form hook for managing form state and validation
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    mode: "onChange", //Validation mode
    resolver: zodResolver(ProductFormSchema), //Zod schema resolver for validation
    defaultValues: {
      //setting default form values from data (if available)
      name: data?.name ?? "",
      description: data?.description ?? "",
      variantName: data?.variantName ?? "",
      variantDescription: data?.variantDescription ?? "",
      categoryId: data?.categoryId,
      subCategoryId: data?.subCategoryId,
      brand: data?.brand ?? "",
      sku: data?.sku ?? "",
      images: data?.images || [],
      colors: data?.colors || [{ color: "" }],
      sizes: data?.sizes,
      keywords: data?.keywords,
      isSale: data?.isSale,
    },
  });

  //Loading state for form submission
  const isLoading = form.formState.isSubmitting;

  //Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  //submit handler for the form
  const handleSubmit = async (values: z.infer<typeof ProductFormSchema>) => {
    try {
      //Upserting category data

      const response = await upsertstore({
        id: data?.id ? data.id : v4(),
        name: values.name,
        description: values.description,
        email: values.email,
        phone: values.phone,

        logo: values.logo[0].url,
        cover: values.cover[0].url,
        url: values.url,
        featured: values.featured ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Displaying success message
      if (data?.id) {
        toast.success("Store has been updated.");
      } else {
        toast.success(`Congratulations!  '${response?.name}' is now created.`);
      }

      // Redirect or Refresh data
      if (data?.id) {
        Router.refresh();
      } else {
        Router.push(`/dashboard/seller/stores/${response?.url}`);
      }

      //Displaying success message
      // toast({
      //   title: data?.id
      //     ? "Category has been updated."
      //     : `Congratulations! '${response?.name}' is now created.} `,
      // });
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
            Product Information
          </CardTitle>
          <CardDescription>
            {data?.productId && data.variantId
              ? `Update ${data?.name} Product information.`
              : "Let's create a Product!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Images - colors */}
              <div className="flex flex-col gap-y-6 xl:flex-row">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          dontShowPreview
                          type="standard"
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
              </div>
              {/* Name */}

              <FormField
                // disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Store name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Description */}
              <FormField
                // disabled={isLoading}
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Store description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "loading..."
                  : data?.productId && data.variantId
                  ? "Save Store information"
                  : "Create Store"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default ProductDetails;
