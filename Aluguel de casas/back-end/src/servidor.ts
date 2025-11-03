import cors from "cors";
 import express from "express";
 import "reflect-metadata";
 import { createConnection } from "typeorm";
 import RotasUsuário from "./rotas/rotas-usuário";
 import RotasInquilino from "./rotas/rotas-inquilino";
 import RotasMoradorAdicional from "./rotas/rotas-morador-adicional";
 const app = express();

 app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Recebida requisição: ${req.method} ${req.originalUrl}`);
  next();
});

 const PORT = process.env.PORT
 const CORS_ORIGIN = process.env.CORS_ORIGIN;
 app.use(cors({ origin: CORS_ORIGIN }));
 app.use(express.json());
 app.use("/usuarios", RotasUsuário);
 app.use("/inquilinos", RotasInquilino);
 app.use("/moradores", RotasMoradorAdicional);
 const conexão = createConnection();
 export default conexão;
 app.listen(PORT || 3333);