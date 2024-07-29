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
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistance, subDays } from "date-fns";
export function FileCard({
  file,
}: {
  file: Doc<"files">& { isFavorited: boolean ,  url : string};
}) {
  // file types
  const typesIcon = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], ReactNode>;


  // favorites ones


  // user profile

  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });

  return (
    <Card className="m-2">
      <CardHeader className="relative">
        <CardTitle className="flex gap-2 text-base font-normal">
          <div className="flex justify-center">{typesIcon[file.type]}</div>
          {file.name}
        </CardTitle>
        <div className="absolute top-2 right-2">
          <FileCardMenu isFavorited={file.isFavorited} file={file} />
        </div>
        {/*<CardDescription>Card Description</CardDescription>*/}
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        {file.type === "image" && (
          <Image
            alt={file.name}
            src={file.url}
            width={100}
            height={100}
            className="h-20"
          />
        )}

        {file.type === "csv" && <GanttChartIcon className="w-20 h-20 " />}

        {file.type === "pdf" && <FileTextIcon className="w-20 h-20" />}
      </CardContent>
      <CardFooter className="flex gap-4 justify-between text-xs">
        <div className="flex gap-2 text-xs text-gray-700 items-center">
          <Avatar className="w-6 h-6">
            <AvatarImage src={userProfile?.image} />
            <AvatarFallback>FD</AvatarFallback>
          </Avatar>
          {userProfile?.name}
        </div>
        <div className="text-xs">
          {formatDistance(
            subDays(new Date(file._creationTime), 3),
            new Date(),
            { addSuffix: true },
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
