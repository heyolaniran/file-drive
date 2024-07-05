import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import { IoDownload } from "react-icons/io5";

export function FileCard({ file }: { file: Doc<"files"> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{file.name}</CardTitle>
        {/*<CardDescription>Card Description</CardDescription>*/}
      </CardHeader>
      <CardContent>
        <p></p>
      </CardContent>
      <CardFooter>
        <Button>
          {" "}
          <IoDownload />{" "}
        </Button>
      </CardFooter>
    </Card>
  );
}
