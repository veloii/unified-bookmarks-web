import { useToaster } from "react-hot-toast/headless";

const Toasts = () => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;

  return (
    <div onMouseEnter={startPause} onMouseLeave={endPause}>
      {toasts
        .filter((toast) => toast.visible)
        .map((toast) => (
          <div className="toast z-50" key={toast.id} {...toast.ariaProps}>
            <div className={`alert ${toast.className}`}>
              <div>
                <span>{toast.message?.toString()}</span>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Toasts;
