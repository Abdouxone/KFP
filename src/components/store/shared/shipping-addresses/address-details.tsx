"use client";
//Prisma Model
import { Commune, Willaya } from "@/generated/prisma/client";

// Schema import
import { ShippingAddressSchema } from "@/lib/schemas";

//React Component
import { FC, useEffect, useState } from "react";

//form handling utilities
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//UI Components

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

// queries import

//Utils
import { v4 } from "uuid";
// import { useToast } from "../ui/use-toast";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// Types
import { userShippingAddressType, WillayaWithCommunesType } from "@/lib/types";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCommuneForWillaya } from "@/queries/user";

interface AddressDetailsProps {
  data?: userShippingAddressType;
  willayas: WillayaWithCommunesType[];
}

const AddressDetails: FC<AddressDetailsProps> = ({ willayas, data }) => {
  //Initializing necessary hooks
  // const { toast } = useToast(); //Hook for displaying toast messages
  const Router = useRouter(); //Hook for programmatic navigation

  //Form hook for managing form state and validation
  const form = useForm<z.infer<typeof ShippingAddressSchema>>({
    mode: "onChange", //Validation mode
    resolver: zodResolver(ShippingAddressSchema), //Zod schema resolver for validation
    defaultValues: {
      //setting default form values from data (if available)
      firstName: data?.firstName ?? "",
      lastName: data?.lastName ?? "",
      address1: data?.address1 ?? "",
      commune: data?.city ?? "",
      phone: data?.phone ?? "",
      default: data?.default,
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
  const handleSubmit = async (
    values: z.infer<typeof ShippingAddressSchema>
  ) => {
    try {
      //Upserting category data

      const response = await upsertShippingAddress({
        id: data?.id ? data.id : v4(),

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

  // State for communes
  const [communes, setCommunes] = useState<Commune[]>([]);

  // UseEffect to get Communes when user pick/change a Willaya
  useEffect(() => {
    const getCommunes = async () => {
      const res = await getAllCommuneForWillaya(form.watch().willayaId);
      setCommunes(res);
    };
    getCommunes();
  }, [form.watch().willayaId]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <FormLabel>Contact Information</FormLabel>
            <div className="flex flex-col md:flex-row gap-3">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="First name*" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Last name*" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              disabled={isLoading}
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex-1 md:w-[calc(50%-8px)] !mt-3">
                  <FormControl>
                    <Input placeholder="Phone number*" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2 ">
            {/* <FormLabel>Address</FormLabel> */}
            <div className="!mt-3 flex items-center justify-between gap-3">
              <FormField
                // disabled={isLoading}
                control={form.control}
                name="willayaId"
                render={({ field }) => (
                  <FormItem className="flex-1 relative">
                    <FormLabel>Choose Willaya</FormLabel>

                    <Select
                      //   disabled={isLoading || categories.length == 0}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a Willaya"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[300px] overflow-y-auto overflow-x-auto scrollbar">
                        {willayas
                          .slice() // make a shallow copy so original array isn’t mutated
                          .sort((a, b) => a.code.localeCompare(b.code)) // ascending by code
                          .map((willaya) => (
                            <SelectItem key={willaya.id} value={willaya.id}>
                              {willaya.code} - {willaya.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("willayaId") && (
                <FormField
                  // disabled={isLoading}
                  control={form.control}
                  name="commune"
                  render={({ field }) => (
                    <FormItem className="!flex-1 ">
                      <FormLabel>Commune</FormLabel>

                      <Select
                        disabled={isLoading || willayas.length == 0}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select a Commune"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {communes.map((sub) => (
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

            <div className="!mt-3 flex flex-col gap-3">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="address1"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Street, house/apartment/unit*"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="rounded-md">
            {isLoading
              ? "loading..."
              : data?.id
              ? "Save address information"
              : "Create address"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddressDetails;
