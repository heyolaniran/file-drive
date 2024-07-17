import { useQuery } from "convex/react";
import FilesBroswer from "../_components/FilesBroswer";
import { api } from "../../../../convex/_generated/api";

export default function FavoritesPage() {
  return (
    <div>
      <FilesBroswer title="Your Favs" favoritesOnly />
    </div>
  );
}
