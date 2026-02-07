interface EmptyTextProps {
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export function EmptyText({
  title,
  subtitle,
  buttonText,
  onButtonClick,
}: EmptyTextProps) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-[20px] font-semibold text-[#F36012] leading-[128%] ">{title}</h2>
      <p className="text-[16px] mt-1 mb-4 font-normal text-[#6C7180] leading-[180%]">{subtitle}</p>
      <button
        onClick={onButtonClick}
        className="rounded bg-[#F36012] px-6 py-[13px] text-[16px] font-medium text-white"
      >
        {buttonText}
      </button>
    </div>
  );
}
