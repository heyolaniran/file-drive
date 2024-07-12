import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import { FileCardMenu } from "./FileCardMenu";
import { ReactNode } from "react";
import { FileTextIcon, GanttChartIcon, ImageIcon } from "lucide-react";

export function FileCard({ file }: { file: Doc<"files"> }) {
  // file types
  const typesIcon = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], ReactNode>;

  // file url

  const getFileURL = (fileId: Id<"_storage">): string => {
    return `${process.env.CONVEX_STORAGE_URL}/api/storage/${fileId}`;
  };

  return (
    <Card className="m-2">
      <CardHeader className="relative">
        <CardTitle className="flex gap-2 text-sm">
          <div className="flex justify-center">
          {typesIcon[file.type]}</div>
          {file.name}
        </CardTitle>
        <div className="absolute top-2 right-2">
          <FileCardMenu file={file} />
        </div>
        {/*<CardDescription>Card Description</CardDescription>*/}
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        {file.type === "image" && (
          <Image
            alt={file.name}
            src={getFileURL(file.fileId)}
            width={100}
            height={100}
          />
        )}

        {file.type === "csv" && <GanttChartIcon className="w-20 h-20 " />}

        {file.type === "pdf" && <FileTextIcon className="w-20 h-20" />}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={() => {
            window.open(getFileURL(file.fileId), "_blank");
          }}
        >
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
