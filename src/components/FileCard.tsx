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
import { FileCardMenu } from "./FileCardMenu";

export function FileCard({ file }: { file: Doc<"files"> }) {
  return (
    <Card className="m-2">
      <CardHeader className="relative">
        <CardTitle className="flex gap-1 justify-between">{file.name}</CardTitle>
        <div className="absolute top-2 right-2">
        <FileCardMenu file={file}/>
        </div>
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
