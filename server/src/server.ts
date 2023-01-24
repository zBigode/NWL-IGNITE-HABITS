import Fastify from "fastify";
import cors from "@fastify/cors";
import { appRoutes } from "./lib/routes";

const app= Fastify()


app.register(cors)

//metodo HTTP: get, put, delete, post patch

app.register(appRoutes)

app.listen({
    port:3333,
    host: "0.0.0.0",
}).then(()=>{
    console.log("to raaodando")
})