import { LockIcon } from "lucide-react";
import { motion } from "framer-motion";

export function ErrorVista() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
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
          No tienes permisos para acceder a esta página.
        </p>

        {/* Botón */}
        <a href="/" className="btn btn-danger px-4 py-2 rounded-lg shadow">
          Volver al inicio
        </a>
      </div>
    </div>
  );
}
