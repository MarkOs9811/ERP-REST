import { toast } from "react-toastify";

const ToastAlert = (type, message) => {
  const options = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    bodyClassName: "toast-body",
  };

  switch (type) {
    case "success":
      toast.success(
        <span dangerouslySetInnerHTML={{ __html: message }} />,
        options
      );
      break;
    case "error":
      toast.error(
        <span dangerouslySetInnerHTML={{ __html: message }} />,
        options
      );
      break;
    case "info":
      toast.info(
        <span dangerouslySetInnerHTML={{ __html: message }} />,
        options
      );
      break;
    case "warning":
      toast.warning(
        <span dangerouslySetInnerHTML={{ __html: message }} />,
        options
      );
      break;
    case "loading":
      toast.loading(
        <span dangerouslySetInnerHTML={{ __html: message }} />,
        options
      );
      break;
    default:
      toast(<span dangerouslySetInnerHTML={{ __html: message }} />, options);
  }
};

export default ToastAlert;
