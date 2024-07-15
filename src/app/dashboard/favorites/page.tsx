import FilesBroswer from "../_components/FilesBroswer";


export default function FavoritesPage() {

    return (
        <div>
            <FilesBroswer title="Your Favs" favorites={true} />
        </div>
    )
}