import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";


const crons = cronJobs() ; 

crons.interval(
    "Delete trash file", 
    {hours : 30} , 
    internal.files.clearTrash
)

export default crons ; 