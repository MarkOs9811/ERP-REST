import { toast } from "react-toastify";

const ToastAlert = (type, message) => {
  const options = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    // Para habilitar HTML en los mensajes
    bodyClassName: "toast-body",
  };

  if (type === "success") {
    toast.success(
      <span dangerouslySetInnerHTML={{ __html: message }} />,
      options
    );
  } else if (type === "error") {
    toast.error(
      <span dangerouslySetInnerHTML={{ __html: message }} />,
      options
    );
  } else if (type === "info") {
    toast.info(<span dangerouslySetInnerHTML={{ __html: message }} />, options);
  } else if (type === "warning") {
    toast.warning(
      <span dangerouslySetInnerHTML={{ __html: message }} />,
      options
    );
  }
};

export default ToastAlert;
