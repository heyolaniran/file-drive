import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, SearchIcon } from "lucide-react";
import { SetStateAction } from "react";

const formSchema = z.object({
  query: z.string().min(0).max(200),
});

export default function SearchBar({
  query,
  setQuery,
}: {
  query: string;
  setQuery: React.Dispatch<SetStateAction<string>>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setQuery(values.query);
  }

  return (
    <div className="flex items-center">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-1">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Search a file" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            size={"sm"}
            type="submit"
            disabled={form.formState.isSubmitting}
            className=""
          >
            {form.formState.isSubmitting && (
              <Loader2 className="animate-spin w-4 h-4" />
            )}
            <SearchIcon className="h-4 w-4 mx-auto" /> Search
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
