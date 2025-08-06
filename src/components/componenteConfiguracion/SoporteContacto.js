import { useForm } from "react-hook-form";

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
    <div className="w-100 p-3">
      <div
        className="card border-0 shadow-sm p-4"
        style={{ maxWidth: 600, margin: "0 auto", borderRadius: 18 }}
      >
        <h3 className="fw-bold mb-3" style={{ color: "#5a7a98" }}>
          Soporte y Contacto
        </h3>
        <p className="text-muted mb-4">
          ¿Tienes dudas, problemas técnicos o necesitas ayuda? Contáctanos y te
          responderemos lo antes posible.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-3">
            <label
              htmlFor="nombre"
              className="form-label text-secondary small fw-semibold"
            >
              Nombre
            </label>
            <input
              id="nombre"
              className="form-control form-control-sm"
              placeholder="Tu nombre"
              {...register("nombre", { required: "El nombre es obligatorio" })}
            />
            <div className="text-danger small">{errors.nombre?.message}</div>
          </div>
          <div className="mb-3">
            <label
              htmlFor="email"
              className="form-label text-secondary small fw-semibold"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              className="form-control form-control-sm"
              placeholder="tu@email.com"
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                  message: "Correo electrónico inválido",
                },
              })}
            />
            <div className="text-danger small">{errors.email?.message}</div>
          </div>
          <div className="mb-3">
            <label
              htmlFor="mensaje"
              className="form-label text-secondary small fw-semibold"
            >
              Mensaje
            </label>
            <textarea
              id="mensaje"
              className="form-control form-control-sm"
              rows={4}
              placeholder="Describe tu consulta o problema"
              {...register("mensaje", {
                required: "El mensaje es obligatorio",
              })}
            />
            <div className="text-danger small">{errors.mensaje?.message}</div>
          </div>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn-sm btn-guardar fw-bold">
              Enviar mensaje
            </button>
          </div>
          {isSubmitSuccessful && (
            <div className="alert alert-success mt-3 py-2 px-3">
              ¡Mensaje enviado correctamente!
            </div>
          )}
        </form>
        <hr className="my-4" />
        <div className="text-center text-muted small">
          También puedes escribirnos a <b>marcosparitorres@gmail.com</b> o
          llamarnos al <b>+51 970435527</b>
        </div>
      </div>
    </div>
  );
}
