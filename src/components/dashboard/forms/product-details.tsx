"use client";
//Prisma Model
import { Category, Store, SubCategory } from "@/generated/prisma/client";

// Schema import
import { ProductFormSchema } from "@/lib/schemas";

//React Component
import { FC, useEffect, useRef, useState } from "react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// queries import
import { upsertProduct } from "@/queries/product";
import { getAllSubCategoriesForCategory } from "@/queries/category";

// ReactTags
import { WithOutContext as ReactTags } from "react-tag-input";

//Utils
import { v4 } from "uuid";

// import { useToast } from "../ui/use-toast";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Types
import { ProductWithVariantType } from "@/lib/types";
import ImagesPreviewGrid from "../shared/images-preview-grid";
import ClickToAddInputs from "./click-to-add";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// React date time picker
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { format } from "date-fns";

// Jodit text editor
import JoditEditor from "jodit-react";

interface ProductDetailsProps {
  data?: Partial<ProductWithVariantType>;
  categories: Category[];
  storeUrl: string;
}

const ProductDetails: FC<ProductDetailsProps> = ({
  data,
  categories,
  storeUrl,
}) => {
  //Initializing necessary hooks
  // const { toast } = useToast(); //Hook for displaying toast messages
  const Router = useRouter(); //Hook for programmatic navigation

  // State for subCategories
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  // Jodit Editor refs
  const productDescEditor = useRef(null);
  const variantDescEditor = useRef(null);

  // State for colors
  const [colors, setColors] = useState<{ color: string }[]>(
    data?.colors || [{ color: "" }]
  );

  // State for sizes
  const [sizes, setSizes] = useState<
    { size: string; price: number; quantity: number; discount?: number }[]
  >(data?.sizes || [{ size: "", quantity: 1, price: 10, discount: 0 }]);

  // State for product specs
  const [productSpecs, setProductSpecs] = useState<
    { name: string; value: string }[]
  >(data?.product_specs || [{ name: "", value: "" }]);

  // State for variant specs
  const [variantSpecs, setVariantSpecs] = useState<
    { name: string; value: string }[]
  >(data?.variant_specs || [{ name: "", value: "" }]);

  // State for questions
  const [questions, setQuestions] = useState<
    { question: string; answer: string }[]
  >(data?.questions || [{ question: "", answer: "" }]);

  // Temporary state for images
  const [images, setImages] = useState<{ url: string }[]>([]);

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
      variantImage: data?.variantImage ? [{ url: data?.variantImage }] : [],
      colors: data?.colors || [{ color: "" }],
      sizes: data?.sizes,
      product_specs: data?.product_specs,
      variant_specs: data?.variant_specs,
      keywords: data?.keywords,
      questions: data?.questions,
      isSale: data?.isSale,
      saleEndDate:
        data?.saleEndDate || format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    },
  });

  // UseEffect to get subCategories when user pick/change a category
  useEffect(() => {
    const getSubcategories = async () => {
      const res = await getAllSubCategoriesForCategory(form.watch().categoryId);
      setSubCategories(res);
    };
    getSubcategories();
  }, [form.watch().categoryId]);

  // Extract errors state from form
  const errors = form.formState.errors;

  //Loading state for form submission
  const isLoading = form.formState.isSubmitting;

  //Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
        variantImage: [{ url: data?.variantImage }],
      });
    }
  }, [data, form]);

  //submit handler for the form
  const handleSubmit = async (values: z.infer<typeof ProductFormSchema>) => {
    try {
      //Upserting category data

      const response = await upsertProduct(
        {
          productId: data?.productId ? data.productId : v4(),
          variantId: data?.variantId ? data.variantId : v4(),
          name: values.name,
          description: values.description,
          variantName: values.variantName,
          variantDescription: values.variantDescription || "",
          categoryId: values.categoryId,
          subCategoryId: values.subCategoryId,
          images: values.images,
          variantImage: values.variantImage[0].url,
          isSale: values.isSale || false,
          brand: values.brand,
          sku: values.sku,
          colors: values.colors,
          sizes: values.sizes,
          product_specs: values.product_specs,
          variant_specs: values.variant_specs,
          keywords: values.keywords,
          questions: values.questions || [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        storeUrl
      );
      // Displaying success message
      if (data?.productId && data?.variantId) {
        toast.success("Product has been updated.");
      } else {
        toast.success(
          `Congratulations!  product'${response?.slug}' is now created.`
        );
      }

      // Redirect or Refresh data
      if (data?.productId && data?.variantId) {
        Router.refresh();
      } else {
        Router.push(`/dashboard/seller/stores/${storeUrl}/products`);
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

  //Handle keywords input
  const [keywords, setKeywords] = useState<string[]>(data?.keywords || []);
  interface Keyword {
    id: string;
    text: string;
  }

  const handleAddition = (keyword: Keyword) => {
    if (keywords.length === 10) return;
    setKeywords([...keywords, keyword.text]);
  };

  const handleDeleteKeyword = (i: number) => {
    setKeywords(keywords.filter((_, index) => index !== i));
  };

  // Whenever colors, sizes, keywords changes we update the form values
  useEffect(() => {
    form.setValue("colors", colors);
    form.setValue("sizes", sizes);
    form.setValue("keywords", keywords);
    form.setValue("product_specs", productSpecs);
    form.setValue("variant_specs", variantSpecs);
  }, [colors, sizes, keywords, productSpecs, variantSpecs, data]);

  // console.log("product description===>", form.getValues().description);
  // console.log("variant description===>", form.getValues().variantDescription);

  console.log("form sizes", form.watch().sizes);
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
                {/* Images */}
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="w-full xl:border-r">
                      <FormControl>
                        <div>
                          <ImagesPreviewGrid
                            images={form.getValues().images}
                            onRemove={(url) => {
                              const updatedImages = images.filter(
                                (img) => img.url !== url
                              );
                              setImages(updatedImages);
                              field.onChange(updatedImages);
                            }}
                            colors={colors}
                            setColors={setColors}
                          />
                          <FormMessage className="!mt-4" />
                          <ImageUpload
                            dontShowPreview
                            type="standard"
                            // cloudinary_key={cloudinary_key}
                            value={field.value.map((image) => image.url)}
                            // disabled={isLoading}
                            onChange={(url) => {
                              setImages((prevImages) => {
                                const updatedImages = [
                                  ...prevImages,
                                  { url: String(url) },
                                ];
                                field.onChange(updatedImages);
                                return updatedImages;
                              });
                            }}
                            onRemove={(url) =>
                              field.onChange([
                                ...field.value.filter(
                                  (current) => current.url !== url
                                ),
                              ])
                            }
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* Colors */}
                <div className="!w-full !flex !flex-col !gap-y-3 xl:pl-5">
                  <ClickToAddInputs
                    details={colors}
                    setDetails={setColors}
                    initialDetail={{ color: "" }}
                    header="Colors"
                    colorPicker
                  />
                  {errors.colors && (
                    <span className="text-sm font-medium text-destructive">
                      {errors.colors.message}
                    </span>
                  )}
                </div>
              </div>
              {/* Name */}
              <div className="flex flex-col lg:flex-row gap-4">
                <FormField
                  // disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product name</FormLabel>
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
                  name="variantName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Variant name</FormLabel>
                      <FormControl>
                        <Input placeholder="variantName" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Product and variant description editors (tabs) */}
              <Tabs defaultValue="product" className="w-full">
                <TabsList className="w-full grid-cols-2">
                  <TabsTrigger value="product">Product description</TabsTrigger>
                  <TabsTrigger value="variant">Variant description</TabsTrigger>
                </TabsList>
                <TabsContent value="product">
                  <FormField
                    // disabled={isLoading}
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <JoditEditor
                            ref={productDescEditor}
                            value={form.getValues().description || ""}
                            onChange={(content) => {
                              form.setValue("description", content);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="variant">
                  <FormField
                    // disabled={isLoading}
                    control={form.control}
                    name="variantDescription"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <JoditEditor
                            ref={variantDescEditor}
                            value={form.getValues().variantDescription || ""}
                            onChange={(content) => {
                              form.setValue("variantDescription", content);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              {/* Category - SubCategory */}
              <div className="flex gap-4 ">
                <FormField
                  // disabled={isLoading}
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="flex-1 relative">
                      <FormLabel>Product Category</FormLabel>

                      <Select
                        disabled={isLoading || categories.length == 0}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select a Category"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("categoryId") && (
                  <FormField
                    // disabled={isLoading}
                    control={form.control}
                    name="subCategoryId"
                    render={({ field }) => (
                      <FormItem className="!flex-1 ">
                        <FormLabel>Product subCategory</FormLabel>

                        <Select
                          disabled={isLoading || categories.length == 0}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="Select a subCategory"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subCategories.map((sub) => (
                              <SelectItem key={sub.id} value={sub.id}>
                                {sub.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              {/* Brand-Sku */}
              <div className="flex flex-col lg:flex-row gap-4">
                <FormField
                  // disabled={isLoading}
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product Brand</FormLabel>
                      <FormControl>
                        <Input placeholder="Brand" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  // disabled={isLoading}
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product Sku</FormLabel>
                      <FormControl>
                        <Input placeholder="Sku" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/*Variant Image -Keywords */}
              <div className="flex items-center gap-10 py-14">
                {/* Variant Image */}
                <div className="border-r pr-10">
                  <FormField
                    control={form.control}
                    name="variantImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="ml-14">Variant Image</FormLabel>
                        <FormControl>
                          <ImageUpload
                            dontShowPreview
                            type="profile"
                            value={field.value.map((image) => image.url)}
                            // disabled={isLoading}
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
                        <FormMessage className="!mt-4" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Keywords */}
                <div className="w-full flex-1 space-y-3">
                  <FormField
                    control={form.control}
                    name="keywords"
                    render={({ field }) => (
                      <FormItem className="relative flex-1">
                        <FormLabel>Product Keywords</FormLabel>
                        <FormControl>
                          <ReactTags
                            handleAddition={handleAddition}
                            handleDelete={() => {}}
                            placeholder="KeyWords (e.g., coude, bronze, multicouche)"
                            classNames={{
                              tagInputField:
                                "bg-background border rounded-md p-2 w-full focus:outline-none",
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-wrap gap-1">
                    {keywords.map((k, i) => (
                      <div
                        key={i}
                        className="text-sm inline-flex items-center px-3 py-1 bg-blue-200 text-blue-700 rounded-full gap-x-2"
                      >
                        <span>{k}</span>
                        <span
                          className="cursor-pointer"
                          onClick={() => handleDeleteKeyword(i)}
                        >
                          x
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Sizes */}
              <div className="w-full flex flex-col gap-y-3 ">
                <ClickToAddInputs
                  details={sizes}
                  setDetails={setSizes}
                  initialDetail={{
                    size: "",
                    quantity: 1,
                    price: 10,
                    discount: 0,
                  }}
                  header="Sizes,   Quantity,   Prices,   Discount"
                />
                {errors.sizes && (
                  <span className="text-sm font-medium text-destructive">
                    {errors.sizes.message}
                  </span>
                )}
              </div>

              {/* product and variant specs */}
              <Tabs defaultValue="productSpecs" className="w-full">
                <TabsList>
                  <TabsTrigger value="productSpecs">
                    Product Specifications
                  </TabsTrigger>
                  <TabsTrigger value="variantSpecs">
                    Variant Specifications
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="productSpecs">
                  <div className="w-full flex flex-col gap-y-3">
                    <ClickToAddInputs
                      details={productSpecs}
                      setDetails={setProductSpecs}
                      initialDetail={{ name: "", value: "" }}
                    />
                    {errors.product_specs && (
                      <span className="text-sm font-medium text-destructive">
                        {errors.product_specs.message}
                      </span>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="variantSpecs">
                  <div className="w-full flex flex-col gap-y-3">
                    <ClickToAddInputs
                      details={variantSpecs}
                      setDetails={setVariantSpecs}
                      initialDetail={{ name: "", value: "" }}
                    />
                    {errors.variant_specs && (
                      <span className="text-sm font-medium text-destructive">
                        {errors.variant_specs.message}
                      </span>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Questions */}
              <div className="w-full flex flex-col gap-y-3 ">
                <ClickToAddInputs
                  details={questions}
                  setDetails={setQuestions}
                  initialDetail={{
                    question: "",
                    answer: "",
                  }}
                  header="Questions & Answers"
                />
                {errors.questions && (
                  <span className="text-sm font-medium text-destructive">
                    {errors.questions.message}
                  </span>
                )}
              </div>

              {/* Is On Sale */}
              <div className="flex border rounded-md">
                <FormField
                  control={form.control}
                  name="isSale"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          // @ts-ignore
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>On Sale</FormLabel>
                        <FormDescription>
                          Is this product on sale?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                {/* Sale End Date */}
                {form.getValues().isSale && (
                  <FormField
                    control={form.control}
                    name="saleEndDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 p-4">
                        <FormControl>
                          <DateTimePicker
                            onChange={(date) => {
                              field.onChange(
                                date
                                  ? format(date, "yyyy-MM-dd'T'HH:mm:ss")
                                  : ""
                              );
                            }}
                            value={field.value ? new Date(field.value) : null}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/*Submit button */}
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "loading..."
                  : data?.productId && data.variantId
                  ? "Save Product information"
                  : "Create Product"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default ProductDetails;
