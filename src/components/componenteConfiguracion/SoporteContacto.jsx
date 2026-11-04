import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Card } from "@/components/ui/card";

export function SoporteContacto() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const onSubmit = (data) => {
    // Aquí puedes enviar los datos a tu backend o servicio de soporte
    alert("Mensaje enviado:\n" + JSON.stringify(data, null, 2));
    reset();
  };

  return (
    <div className="w-full p-3">
      <Card
        className="border p-4"
        style={{ maxWidth: 600, margin: "0 auto", borderRadius: 18 }}
      >
        <h3 className="font-bold mb-3" style={{ color: "#5a7a98" }}>
          Soporte y Contacto
        </h3>
        <p className="text-muted-foreground mb-4">
          ¿Tienes dudas, problemas técnicos o necesitas ayuda? Contáctanos y te
          responderemos lo antes posible.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-3">
            <label
              htmlFor="nombre"
              className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground text-sm font-semibold"
            >
              Nombre
            </label>
            <input
              id="nombre"
              className="w-full rounded-md border-input bg-background py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs"
              placeholder="Tu nombre"
              {...register("nombre", { required: "El nombre es obligatorio" })}
            />
            <div className="text-destructive text-sm">
              {errors.nombre?.message}
            </div>
          </div>
          <div className="mb-3">
            <label
              htmlFor="email"
              className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground text-sm font-semibold"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border-input bg-background py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs"
              placeholder="tu@email.com"
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                  message: "Correo electrónico inválido",
                },
              })}
            />
            <div className="text-destructive text-sm">
              {errors.email?.message}
            </div>
          </div>
          <div className="mb-3">
            <label
              htmlFor="mensaje"
              className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground text-sm font-semibold"
            >
              Mensaje
            </label>
            <textarea
              id="mensaje"
              className="w-full rounded-md border-input bg-background py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 px-2.5 text-xs"
              rows={4}
              placeholder="Describe tu consulta o problema"
              {...register("mensaje", {
                required: "El mensaje es obligatorio",
              })}
            />
            <div className="text-destructive text-sm">
              {errors.mensaje?.message}
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 text-xs btn-guardar font-bold"
              variant="default"
            >
              Enviar mensaje
            </Button>
          </div>
          {isSubmitSuccessful && (
            <div className="relative w-full rounded-lg text-sm border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 mt-3 py-2 px-3">
              ¡Mensaje enviado correctamente!
            </div>
          )}
        </form>
        <hr className="my-4" />
        <div className="text-center text-muted-foreground text-sm">
          También puedes escribirnos a <b>marcosparitorres@gmail.com</b> o
          llamarnos al <b>+51 970435527</b>
        </div>
      </Card>
    </div>
  );
}
