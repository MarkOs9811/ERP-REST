import { Link } from "react-router-dom";
import { LockIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";

export function ErrorVista() {
  return (
    <div
      className="flex justify-center items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="text-center">
        {/* Ícono animado */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-4"
        >
          <LockIcon size={120} className="text-red-600" />
        </motion.div>

        {/* Título */}
        <h1 className="text-5xl font-bold text-red-700 mb-3">
          Acceso Denegado
        </h1>

        {/* Descripción */}
        <p className="text-lg text-gray-600 mb-4">
          No tienes permisos para acceder a esta página. :c
        </p>

        {/* Botón */}
        <Button asChild variant="outline">
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
