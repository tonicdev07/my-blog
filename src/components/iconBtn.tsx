export function IconBtn({
  Icon,
  isActive,
  color,
  children,
  onClick, // onClick ni qo'shing
  disabled, // disabled ni qo'shing
  ...props
}: {
  Icon: React.ComponentType<any>;
  isActive?: boolean;
  color?: string;
  children?: React.ReactNode;
  onClick: () => void; // onClick xususiyatini qo'shing
  disabled?: boolean; // disabled xususiyatini qo'shing
}) {
  return (
    <button
      className={`btn icon-btn ${isActive ? "icon-btn-active" : ""} ${
        color || ""
      }`}
      onClick={onClick} // onClick ni ko'rsatish
      disabled={disabled} // disabled ni ko'rsatish
      {...props}
    >
      <span className={`${children != null ? "mr-1" : ""}`}>
        <Icon />
      </span>
      {children}
    </button>
  );
}
